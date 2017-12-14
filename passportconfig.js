const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy=require('passport-facebook').Strategy;
const TwitterStrategy= require('passport-twitter').Strategy;

const localTwitterCallback='http://localhost:5000/api/login/twitter/connect/callback';
const externalTwitterCallback='https://freecodecampdynprojects.herokuapp.com/api/login/twitter/connect/callback';
//const dbService = require('./dbFactory');
const dbService =process.env.NODE_ENV !== 'production'?require('./src/server/dbFactory'):require('./dbFactory');
module.exports=(app,passport)=>{
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        dbService.setUrl(app.MONGODB);
        dbService.connect().then(() => dbService.searchByID({collectionName: 'users',queryParam: {_id:id}}))
            .then(resultSearch => {
                dbService.disconnect();
                done(null, resultSearch[0]);
            })
            .catch(err => {
                dbService.disconnect();
                console.log('====================================');
                console.log(`error deserializing user:${err}`);
                console.log('====================================');
                return done(err, null);
            });
    });
    passport.use('local-login', new LocalStrategy({
        userNameField: 'mail',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, mail, password, done) => {
        dbService.setUrl(app.MONGODB);
        dbService
            .connect()
            .then(() => dbService.search({
                collectionName: 'users',
                queryParam: {
                    local_email: mail
                }
            }))
            .then(resultsearch => {
                dbService.disconnect();
                if (resultsearch.length){
                    if (dbService.comparePassword(password,resultsearch[0].local_password)==='PWD_OK'){
                        return done(null,{
                                id:resultsearch[0]._id,
                                twitter_id: '0',
                                twitter_user_token: '0',
                                twitter_user_secret:'0',
                                twitter_username: '0',
                                twitter_display_name: '0',
                                local_password: password,
                                local_email: mail,
                                facebook_id: '0',
                                facebook_token: '0',
                                facebook_display_name: '0',
                                facebook_username: '0',
                                full_name:resultsearch[0].full_name,
                                city:resultsearch[0].city,
                                state:resultsearch[0].state,
                                country:resultsearch[0].country
                            });
                    }
                    else{
                        return done(null,false);
                    }
                }
                else{
                    return done(null,false);
                }
            })
            .catch(err => {
                dbService.disconnect();
                console.log('====================================');
                console.log(`error local-login err:${err}`);
                console.log('====================================');
                return done(err);
            });
    }));
    passport.use('local-signup', new LocalStrategy({
        userNameField: 'mail',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, done) => {
        dbService.setUrl(app.MONGODB);
        dbService
            .connect()
            .then(()=>dbService.search({collectionName:'users',queryParam:{local_email:email}}))
            .then(resultsearch => {
                if (resultsearch.length){
                    dbService.disconnect();
                    return done(null, false);
                }
                else{
                    let NewUser = {
                        twitter_id: '0',
                        twitter_user_token: '0',
                        twitter_user_secret:'0',
                        twitter_username: '0',
                        twitter_display_name: '0',
                        local_password: password,
                        local_email: email,
                        facebook_id: '0',
                        facebook_token: '0',
                        facebook_display_name: '0',
                        facebook_username: '0',
                        full_name:'0',
                        city:'0',
                        state:'0',
                        country:'0'
                    };
                    dbService.injectOneItem({collectionName: 'users', data: NewUser})
                        .then(resultInject => {
                            dbService.disconnect();
                            NewUser.id = resultInject;
                            return done(null, NewUser);
                        })
                        .catch(errInject => {
                            console.log('====================================');
                            console.log(`error strat inject data err:${errInject}`);
                            console.log('====================================');
                            return done(errInject, null);
                        });
                }
            })
            .catch(err => {
                dbService.disconnect();
                console.log('====================================');
                console.log(`error local-login err:${err}`);
                console.log('====================================');
                return done(err);
            });
    }));
    

    //region twitter auth
    passport.use(new TwitterStrategy({
        consumerKey: app.locals.TWITTER_APP_ID,
        consumerSecret: app.locals.TWITTER_APP_SECRET,
        callbackURL:process.env.NODE_ENV !== 'production'?localTwitterCallback:externalTwitterCallback,
        passReqToCallback:true,
        includeEmail:true
    },(req, token, tokenSecret, profile, done)=>{
       /*  console.log('====================================');
        console.log(`app.locals.APP_SWITCH value ssss:${app.locals.APP_SWITCH}`);
        console.log('===================================='); */
        process.nextTick(()=>{
            dbService.setUrl(app.MONGODB);
            let dataUser = {
                id:'',
                twitter_id: '0',
                twitter_user_token: '0',
                twitter_user_secret:'0',
                twitter_username: '0',
                twitter_display_name: '0',
                local_password: '0',
                local_email: '0',
                facebook_id: '0',
                facebook_token: '0',
                facebook_display_name: '0',
                facebook_username: '0',
                full_name:'0',
                city:'0',
                state:'0',
                country:'0'
            };
            // change to email
            if (!req.user){
                dbService.connect()
                .then(()=>dbService.search({collectionName:'users',queryParam:{local_email: profile.emails[0].value}}))
                .then(resultSearchUsers=>{
                   
                    if (resultSearchUsers.length){
                        dataUser.id= resultSearchUsers[0]._id; 
                        dataUser.twitter_user_token=resultSearchUsers[0].twitter_user_token;
                        dataUser.twitter_user_secret= resultSearchUsers[0].twitter_user_secret;
                        dataUser.local_password=resultSearchUsers[0].local_password;
                        dataUser.local_email=resultSearchUsers[0].local_email;
                        dataUser.full_name=resultSearchUsers[0].full_name;
                        dataUser.city=resultSearchUsers[0].city;
                        dataUser.state=resultSearchUsers[0].state;
                        dataUser.country=resultSearchUsers[0].country;

                        if (dataUser.twitter_user_token=='0'){
                            dataUser.twitter_user_token= token;
                            dataUser.twitter_user_secret= tokenSecret;
                            dataUser.twitter_username= profile.displayName;
                            dataUser.twitter_display_name= profile.displayName;
                            dataUser.twitter_id= profile.id;
                            /* console.log('====================================');
                            console.log(`data no user token serialized:\n${JSON.stringify(dataUser,null,2)}`);
                            console.log('===================================='); */
                            dbService.updateById(
                                {
                                    collectionName:'users',
                                    queryParam:{
                                        dataselect:{
                                            item:dataUser.id
                                        },
                                        datacriteria:{
                                            $set:{
                                                twitter_id:dataUser.twitter_id,
                                                twitter_user_token:dataUser.twitter_user_token,
                                                twitter_user_secret:dataUser.twitter_user_secret,
                                                twitter_display_name:dataUser.twitter_display_name,
                                                twitter_username:dataUser.twitter_username
                                            }
                                        }
                                    }
                                })
                                .then(resultUpdatenoToken=>{
                                    console.log('====================================');
                                    console.log(`result no token:${JSON.stringify(resultUpdatenoToken,null,2)} \ndata user updated:${JSON.stringify(dataUser,null,2)}`);
                                    console.log('====================================');
                                    dbService.disconnect();
                                    return done(null,dataUser);
                                })
                                .catch(errUserUpdateExists=>{
                                    dbService.disconnect();
                                    console.log('====================================');
                                    console.log(`error fb-login err not logged in update data\n:${errUserUpdateExists}`);
                                    console.log('====================================');
                                    return done(errUserUpdateExists);
                                });
                        }
                        return done(null,dataUser);
                    }
                    else{
                        dataUser.twitter_id= profile.id;
                        dataUser.twitter_user_token= token;
                        dataUser.twitter_user_secret= tokenSecret;
                        dataUser.twitter_username=profile.username;
                        dataUser.twitter_display_name= profile.displayName;
                        dataUser.local_email= profile.emails[0].value;
                        
                        dbService.injectOneItem({collectionName:'users',data:dataUser})
                            .then(resultCreateUser=>{
                                dbService.disconnect();
                                dataUser.id=resultCreateUser;
                                return done(null,dataUser);
                            })
                            .catch(errCreateUser=>{
                                dbService.disconnect();
                                console.log('====================================');
                                console.log(`error tw-login err not logged in update data\n:${errCreateUser}`);
                                console.log('====================================');
                                return done(errCreateUser);
                            });

                    }
                })
                .catch(errorFbConnect=>{
                    dbService.disconnect();
                    console.log('====================================');
                    console.log(`error tw-login err:${errorFbConnect}`);
                    console.log('====================================');
                    return done(errorFbConnect);
                });
            }
            else{
               dataUser.id=req.user._id;
               dataUser.twitter_id= profile.id;
               dataUser.twitter_user_token= token;
               dataUser.twitter_user_secret= tokenSecret;
               dataUser.twitter_username=profile.username;
               dataUser.twitter_display_name= profile.displayName;
               dbService.connect().then(()=>dbService.updateById(
                {
                    collectionName:'users',
                    queryParam:{
                        dataselect:{
                            item:dataUser.id
                         },
                         datacriteria:{
                             $set:{
                                twitter_id:dataUser.twitter_id,
                                twitter_user_token:dataUser.twitter_user_token,
                                twitter_user_secret:dataUser.twitter_user_secret,
                                twitter_display_name:dataUser.twitter_display_name,
                                twitter_username:dataUser.twitter_username
                             }
                         }
                }}))
                .then(resultUpdateInfoUserPresent=>{
                    console.log('====================================');
                    console.log(`result from resultUpdateInfoUserPresent:${JSON.stringify(resultUpdateInfoUserPresent,null,2)}`);
                    console.log('====================================');
                    dbService.disconnect();
                    return done(null,dataUser);
                })
                .catch(errUpdateInfoLogged=>{
                    dbService.disconnect();
                    console.log('====================================');
                    console.log(`error fb-login err already logged in update data\n:${errUpdateInfoLogged}`);
                    console.log('====================================');
                    return done(errUpdateInfoLogged);
                });
            }
        });
    }));
    //endregion

    //facebook auth
    passport.use(new FacebookStrategy({
        clientID:app.locals.FACEBOOK_APP_ID, 
        clientSecret:app.locals.FACEBOOK_APP_SECRET,
        callbackURL:'http://localhost:5000/api/login/fb/connect/callback',//test with process.env
        passReqToCallback:true,
        profileFields:['id','displayName','emails','name']
        
    },(req,accessToken,refreshToken,profile,done)=>{
        process.nextTick(()=>{
            dbService.setUrl(app.MONGODB);
            let dataUser = {
                id:'',
                twitter_id: '0',
                twitter_user_token: '0',
                twitter_user_secret:'0',
                twitter_username: '0',
                twitter_display_name: '0',
                local_password: '0',
                local_email: '0',
                facebook_id: '0',
                facebook_token: '0',
                facebook_display_name: '0',
                facebook_username: '0',
                full_name:'0',
                city:'0',
                state:'0',
                country:'0'
            };
            // change to email
            if (!req.user){
                dbService.connect()
                .then(()=>dbService.search({collectionName:'users',queryParam:{local_email: profile.emails[0].value}}))
                .then(resultSearchUsers=>{
                    if (resultSearchUsers.length){
                        dataUser= resultSearchUsers[0];
                        if (!dataUser.facebook_token){
                            dataUser.facebook_token= accessToken;
                            dataUser.name= profile.name.givenName + ' ' + profile.name.familyName;
                            dataUser.facebook_display_name= profile.name.givenName + ' ' + profile.name.familyName;
                            dbService.updateById(
                                {
                                    collectionName:'users',
                                    queryParam:{
                                        dataselect:{
                                            item:dataUser.id
                                        },
                                        datacriteria:{
                                            $set:{
                                                facebook_token:dataUser.facebook_token,
                                                full_name:dataUser.name,
                                                facebook_display_name:dataUser.facebook_display_name
                                            }
                                        }
                                    }
                                })
                                .then(resultUpdatenoToken=>{
                                    console.log('====================================');
                                    console.log(`result no token:${JSON.stringify(resultUpdatenoToken,null,2)}`);
                                    console.log('====================================');
                                    dbService.disconnect();
                                    return done(null,dataUser);
                                })
                                .catch(errUserUpdateExists=>{
                                    dbService.disconnect();
                                    console.log('====================================');
                                    console.log(`error fb-login err not logged in update data\n:${errUserUpdateExists}`);
                                    console.log('====================================');
                                    return done(errUserUpdateExists);
                                });
                        }
                        return done(null,dataUser);
                    }
                    else{
                        dataUser.facebook_id= profile.id;
                        dataUser.facebook_token= accessToken;
                        dataUser.name= profile.name.givenName + ' ' + profile.name.familyName;
                        dataUser.facebook_display_name= profile.name.givenName + ' ' + profile.name.familyName;
                        dbService.injectOneItem({collectionName:'users',data:dataUser})
                            .then(resultCreateUser=>{
                                console.log('====================================');
                                console.log(`resultAdd fb user:${JSON.stringify(resultCreateUser,null,2)}`);
                                console.log('====================================');
                                dataUser.id=resultCreateUser;
                                return done(null,dataUser);
                            })
                            .catch(errCreateUser=>{
                                dbService.disconnect();
                                console.log('====================================');
                                console.log(`error fb-login err not logged in update data\n:${errCreateUser}`);
                                console.log('====================================');
                                return done(errCreateUser);
                            });

                    }
                })
                .catch(errorFbConnect=>{
                    dbService.disconnect();
                    console.log('====================================');
                    console.log(`error fb-login err:${errorFbConnect}`);
                    console.log('====================================');
                    return done(errorFbConnect);
                });
            }
            else{
               dataUser= req.user;
               dataUser.facebook_id= profile.id;
               dataUser.facebook_token= accessToken;
               dataUser.full_name=profile.name.givenName + ' ' + profile.name.familyName;
               dataUser.facebook_display_name= profile.name.givenName + ' ' + profile.name.familyName;
               dbService.updateById(
                   {
                       collectionName:'users',
                       queryParam:{
                           dataselect:{
                               item:dataUser.id
                            },
                            datacriteria:{
                                $set:{
                                    facebook_id:dataUser.facebook_id,
                                    facebook_token:dataUser.facebook_token,
                                    full_name:dataUser.name,
                                    facebook_display_name:dataUser.facebook_display_name
                                }
                            }
                        }})
                .then(resultUpdateInfoUserPresent=>{
                    console.log('====================================');
                    console.log(`result from resultUpdateInfoUserPresent:${JSON.stringify(resultUpdateInfoUserPresent,null,2)}`);
                    console.log('====================================');
                    dbService.disconnect();
                    return done(null,dataUser);
                })
                .catch(errUpdateInfoLogged=>{
                    dbService.disconnect();
                    console.log('====================================');
                    console.log(`error fb-login err already logged in update data\n:${errUpdateInfoLogged}`);
                    console.log('====================================');
                    return done(errUpdateInfoLogged);
                });
            }
        });
    }));
};