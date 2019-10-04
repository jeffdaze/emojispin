<template>
    <div class="frame">
        <p class="bannerMessage">{{ this.$store.getters.getUserMessage }}</p>
        <div class="box">{{ box1.val }}</div><div class="box">{{ box2.val }}</div><div class="box">{{ box3.val }}</div>
        <div><button :disabled="spinning" @click="randomSpin">SPIN!</button></div>
        <p class="coinDisplay">💵 {{ this.$store.getters.getCoins }}</p>
    </div>
</template>

<script>
// this might be useful for the background...🎰

//get firebase stuff...
import { db } from '@/main'
import { fba } from '@/main'
import { fbs } from '@/main'


export default {
    props: ['credits'],
    data: function(){
        return{
            charArr:['🎩','🕶','🐳','⚡️','🍫','🎱','🏹','🧩','🚀','🎉'],
            box1:{ val: '🎰', stopped: true },
            box2:{ val: '🎰', stopped: true },
            box3:{ val: '🎰', stopped: true },
            localCredits: 0,
            spinning:false,
            uid:""
        };
    },
    created: function(){
        //for use inside interior context...
        let vt = this;
        
        //log in our user...
        fba.signInAnonymously()
            .then(function(){
                //console.log("User auth successful!");
                return true;

            }).catch(function(error) {
                let errorCode = error.code;
                let errorMessage = error.message;
                //on error we want to see the problem in the console...
                // eslint-disable-next-line
                console.log("login error", errorMessage, errorCode);
            });

        //now get our user id to track this user...
        fba.onAuthStateChanged(function(user) {
            //if we have a user, set the uid value for later use...
            if (user) {
                //set our local value and our store value...
                vt.uid = user.uid;

                //scaffold our store values...
                vt.$store.commit('setUserId', user.uid);

                //create a set for it if it does not already exist and init the credits value
                //looks like repeat visit will generate the same UID for the same session...
                db.collection('items').doc(user.uid).get()
                    .then(docVal =>{
                        if(docVal.exists){
                            //user has already been here!
                            
                            //fire the coins watcher in the state manager...
                            vt.$store.dispatch('setCoins');
                            vt.$store.dispatch('setUserMessage');
                            
                            //do a query here...
                            db.collection('items').doc(user.uid).get().then(
                                docData => {
                                    //set the credits to the value from the db...
                                    vt.localCredits = docData.data().credits;
                                }
                            );
                            

                        }else{
                            //this is a new account...
                            vt.localCredits = vt.credits;

                            db.collection('items').doc(user.uid).set({
                                spins:[],
                                message: "Good luck!",
                                credits: vt.credits
                            });

                            //fire the coins watcher in the state manager...
                            vt.$store.dispatch('setCoins');
			    vt.$store.dispatch('setUserMessage');
                        }
                    }); 
            }
        });

    },
    methods:{
        randomSpin(){
            let vt = this;

            if(this.localCredits){

                this.spinning = !this.spinning;

                //pay for a spin...
                this.localCredits--;

                //kick off first spin...
                this.singleSpin("box1");

                //slight delay between spins...
                setTimeout(function(){
                    vt.singleSpin("box2");
                }, 300)

                setTimeout(function(){
                    vt.singleSpin("box3");
                }, 500)
            }

        },
        singleSpin(box){
            //how many spins?
            let spinCount = this.getRandNum(1, 4) * this.charArr.length;

            //what position?
            let spinPos = this.getRandNum(0, this.charArr.length);

            //need to alias this for setTimeout...
            let vt = this;

            for(let i = 0; i < spinCount+spinPos; i++){
                setTimeout(function(){
                    vt[box].stopped = false;
                    //last iteration...
                    if(i == spinCount+spinPos-1){
                        vt[box].stopped = true;

                        //check to see if all boxes are done spinning...
                        //@TODO: this is kind of hackish; refactor to use async with a Promises.all
                        //might work a bit better...
                        if(vt.box1.stopped && vt.box2.stopped && vt.box3.stopped){
                            vt.spinning = false;

                            //don't forget to set the value before storing the result!
                            //otherwise the last box to stop will be one char behind...
                            vt[box].val = vt.charArr[i % vt.charArr.length];


                            //check victory states here...
                            let victory = "";
                            let coinsUp = 0;
                            //jackpot check:
                            if(vt.box1.val == vt.box2.val && vt.box2.val == vt.box3.val){
                                victory = "jackpot";
                                coinsUp = 200;
                            }

                            //could loop here, but there aren't many combinations..
                            if(vt.box1.val == vt.box2.val || vt.box1.val == vt.box3.val || vt.box2.val == vt.box3.val){
                                victory = "standard";
                                coinsUp = 10;
                            }

                            vt.localCredits += coinsUp;

                            //and kick off the checks for victory state...
                            //then update the remote datastore...
                            //note! the object firestore is *different* than the method imported...
                            db.collection('items').doc(vt.uid).update({
                                spins: fbs.firestore.FieldValue.arrayUnion({
                                    result: {
                                        box1: vt.box1,
                                        box2: vt.box2,
                                        box3: vt.box3,
                                        victory: victory,
                                        coinsUp: coinsUp
                                    },
                                    created_at: Date.now()
                                })        
                            }).then((response) => {
                                if (response) {
                                    //handle response here...
                                }
                            }).catch((error) => {
                                this.errors = error
                            })

                        }

                        //also update the remote credit store value...
                        db.collection('items').doc(vt.uid).update({
                            credits: vt.localCredits
                        });

                    }

                    

                    vt[box].val = vt.charArr[i % vt.charArr.length];
                }, i * 100);
            }
            

        },
        getRandNum(min, max){
			return Math.floor(Math.random() * (max-min+1)+min);
		}
    }    
}
</script>

<style scoped>
.box{
    width:60px;
    height:60px;
    border:1px solid #333;
    border-radius: 25%;
    margin: 20px;
    display: inline-block;
    text-align: center;
    line-height: 70px;
    font-size: 40px;
}

.coinDisplay{
    font-size: 40px;
}

BUTTON{
    width:200px;
    height:50px;
    border-radius: 5%;
    background:cornflowerblue;
    font-size: 30px;
    margin-top:20px;
    cursor:pointer;
}
</style>