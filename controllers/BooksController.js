//sets the imports according to the flag in question
const httpService=process.env.NODE_ENV !== 'production'?require('../src/server/httpService'):require('./httpService');
const dbService=process.env.NODE_ENV !== 'production'?require('../src/server/dbFactory'):require('./dbFactory');
const logger=  process.env.NODE_ENV!== 'production' ? require('../logger'):require('./logger');
//
const path = require('path');
module.exports = {
    /**
     * gets all the books added to the collection
     * @param {*} request express request sent from the client
     * @param {*} response express response to be sent to the client
     */
    getAllBooks(request, response) {
        dbService.setUrl(request.app.MONGODB);
        dbService.connect().then(() => {
                Promise.all([
                    dbService.search({collectionName: 'books', queryParam: {}}),
                    dbService.search({collectionName: 'users', queryParam: {}}),
                    dbService.search({collectionName: 'book_trades', queryParam: {}})
                ]).then(responses => {
                    dbService.disconnect();
                    const dbBooks = responses[0];
                    const dbUsers = responses[1];
                    const bookTrades = responses[2];

                    const resultsbooks = [];
                    if ((!dbBooks.length) && (!dbUsers.length)) {
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: 'fccda005', userData: "NO DATA"}));
                        return;
                    }
                    
                    for (let item of dbBooks) {
                        for (let itemBook of item.booklist) {
                            const userindb = dbUsers.find(x => x._id == item.user);
                            
                            if (userindb) {
                                const bookIstraded = bookTrades.find(x => x.bookid == itemBook.idbook && x.statustrade == 1);
                                let userTraded = undefined;
                                if (bookIstraded) {
                                    userTraded = dbUsers.find(x => x._id == bookIstraded.tradedto);
                                }
                                resultsbooks.push({
                                    booktoken: itemBook.idbook,
                                    bookowner:{
                                        token:item.user,
                                        name:userindb.full_name==null?userindb.local_email:userindb.full_name,
                                        bookownercontact: userindb.local_email
                                    },
                                    //bookowner: item.user,
                                    bookname: itemBook.name,
                                    bookauthor: itemBook.author,
                                    bookcover: itemBook.imgcover,
                                    bookreview: itemBook.review,
                                    bookownercontact: userindb.local_email,
                                    bookisbeingtraded: bookIstraded === undefined? false: true,
                                    bookbeingtradedto: userTraded === undefined? '': userTraded.local_email
                                });
                            }
                        }
                    }
                    response.writeHead(200, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: 'fccda005', bookData: resultsbooks}));
                }).catch(errSearches => {
                    dbService.disconnect();
                    logger.error(`get books error promise all searches:${JSON.stringify(errSearches,null,2)}`);
                    // console.log('====================================');
                    // console.log(`error promise all searches:${JSON.stringify(errSearches,null,2)}`);
                    // console.log('====================================');
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                });
            })
            .catch(err => {
                logger.error(`error getting the books:${JSON.stringify(err,null,2)}`);
                // console.log('====================================');
                // console.log(`error getting the books:${err}`);
                // console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
            });
    },
    /**
     * adds a book  to the collection
     * @param {*} request express request sent from the client
     * @param {*} response express response to be sent to the client
     */
    addBookCollection(request, response) {
        if ((!request.body.usertoken) || (!request.body.bookName)) {
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "some information for the book submission was not provided"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect().then(() => dbService.search({collectionName: 'books',queryParam: {user: request.body.usertoken}}))
            .then(resultbookuser => {
                if (resultbookuser.length) {
                    dbService.updateData({
                        collectionName: 'books',
                        queryParam: {
                            dataselect: {user: request.body.usertoken},
                            datacriteria: {
                                $addToSet: {
                                    booklist: {
                                        idbook: request.body.bookId,
                                        name: request.body.bookName,
                                        author: request.body.authorName,
                                        imgcover: request.body.imgCoverLocation === undefined? '': request.body.imgCoverLocation,
                                        review: request.body.bookReview === undefined? '': request.body.bookReview
                                    }
                                }

                            }

                        }
                    }).then(() => {
                        dbService.disconnect();
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: 'fccda005', reason: `The book:${request.body.bookName} was added to the collection`}));
                    }).catch(err => {
                        dbService.disconnect();
                        logger.error(`error adding the books:${err}`);
                        // console.log('====================================');
                        // console.log(`error adding the books:${err}`);
                        // console.log('====================================');
                        response.writeHead(500, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                    });
                } else {
                    dbService.injectOneItem(
                        {
                            collectionName: 'books',
                            data: {
                                user: request.body.usertoken,
                                booklist: [
                                    {
                                        idbook: request.body.bookId,
                                        name: request.body.bookName,
                                        author: request.body.authorName === undefined? "": request.body.authorName,
                                        imgcover: request.body.coverlink === undefined? "": request.body.coverlink,
                                        review: request.body.reviewlink === undefined? "": request.body.reviewlink
                                    }
                            ]
                        }
                    })
                    .then(() => {
                        dbService.disconnect();
                        response.writeHead(200, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: 'fccda005', reason: `The book:${request.body.bookName} was added to the collection`}));
                    })
                    .catch(errInjectbook => {
                        dbService.disconnect();
                        logger.error(`error adding the books no collection:${JSON.stringify(errInjectbook,null,2)}`);
                        // console.log('====================================');
                        // console.log(`error adding the books:${errInjectbook}`);
                        // console.log('====================================');
                        response.writeHead(500, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                    });
                }
            })
            .catch(errconnect => {
                logger.error(`error connect adding the books on connect:${errconnect}`);
                // console.log('====================================');
                // console.log(`error connect adding the books:${JSON.stringify(errconnect,null,2)}`);
                // console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
            });

    },
    /**
     * starts the trade book process
     * @param {*} request express request sent from the client
     * @param {*} response express response to be sent to the client
     */
    tradeBook(request, response) {
        let resultInfo={apiKey:request.app.BLUEKEY,infoowner:'',infotrader:'',book:'',token:''};
        dbService.setUrl(request.app.MONGODB);
        dbService.connect().then(() => {
            Promise.all([
                dbService.search({collectionName: 'book_trades',queryParam: {$and: [{statustrade: 0}, {bookid: request.body.bookid}]}}),
                dbService.search({collectionName: 'users', queryParam: {}}),
                dbService.searchUniqueSubDocument({
                    collectionName: 'books',
                    queryParam: [
                        {
                            $match: {
                                'booklist.idbook': request.body.bookid
                            }
                        }, 
                        {
                            $project: {
                                booklist: {
                                    $filter: {
                                        input: '$booklist',
                                        as: 'itembook',
                                        cond: {
                                            $eq: ['$$itembook.idbook', request.body.bookid]
                                        }
                                    }
                                },
                                _id: 0
                            }
                        }
                    ]
                })
            ]).then(resultdatatrade => {
                if (resultdatatrade[0].length) {
                    dbService.disconnect();
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001", reason: "The item in question is currently being traded by another person"}));
                    return;
                }
                dbService.injectOneItem({
                    collectionName: 'book_trades',
                    data: {
                        bookid: request.body.bookid,
                        tradedto: request.body.tradeuser,
                        bookowner: request.body.bookowner,
                        statustrade: 0
                    }
                })
                .then(resulttradeadd => {
                    dbService.disconnect();
                    const usertrading = resultdatatrade[1].find(x => x._id == request.body.tradeuser);
                    const userowner = resultdatatrade[1].find(t => t._id == request.body.bookowner);
                    //const infobook= resultdatatrade[2][0].booklist[0];
                            // send email for trade request with with id of the injected document
                    resultInfo.infoowner= userowner.local_email;
                    resultInfo.infotrader= usertrading.local_email;
                    resultInfo.name=resultdatatrade[2][0].booklist[0].name;
                   
                    resultInfo.book= resultdatatrade[2].name;
                    resultInfo.token= resulttradeadd;
                   
                    httpService.sendMail(resultInfo).then(resultMail=>{
                        if (resultMail){
                            response.writeHead(200, {'Content-Type': 'application/json'});
                            response.end(JSON.stringify({code: "fccda005", reason: "TRADEREQUESTOK"}));
                            return;
                       }
                       response.writeHead(500, {'Content-Type': 'application/json'});
                       response.end(JSON.stringify({code: "fccda001", reason: "ERROR NOTIFICATION"}));
                    }).catch(errsendmail=>{
                        // console.log('====================================');
                        // console.log(`error sendmail the books:${JSON.stringify(errsendmail,null,2)}`);
                        // console.log('====================================');
                        logger.error(`Error sending mail:${errsendmail}`);
                        response.writeHead(500, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                    });
                })
                .catch(errorinjecttrade => {
                    dbService.disconnect();
                    logger.error(`Error injecting the book trade:${JSON.stringify(errorinjecttrade,null,2)}`);
                    // console.log('====================================');
                    // console.log(`error errorinjecttrade the books:${JSON.stringify(errorinjecttrade,null,2)}`);
                    // console.log('====================================');
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                });
            }).catch(errordatatrade => {
                    //dbService.disconnect();
                logger.error(`error trading the books:${JSON.stringify(errordatatrade,null,2)}`);
                // console.log('====================================');
                // console.log(`error trading the books:${JSON.stringify(errordatatrade,null,2)}`);
                // console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
            });
        })
        .catch(errorConnect => {
            logger.error(`error connect trading the books:${JSON.stringify(errorConnect,null,2)}`);
            // console.log('====================================');
            // console.log(`error trading the books:${errorConnect}`);
            // console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        });
    },
    /**
     * rejects the book trade
     * @param {*} request express request sent from the client
     * @param {*} response express response to be sent to the client
     */
    tradeReject(request, response) {
        if (!request.query.tokentrade) {
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda005", reason: "NO TOKEN PROVIDED"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect().then(() => dbService.updateById({
                collectionName: 'book_trades',
                queryParam: {
                    dataselect: {
                        item: request.query.tokentrade
                    },
                    datacriteria: {
                        $set: {
                            statustrade: 2
                        }
                    }
                }
        }))
        .then(() => {
            dbService.disconnect();
            /* console.log('====================================');
            console.log(`resultRejectTrade removing the trade of the books:${resultRejectTrade}`);
            console.log('===================================='); */
            response.sendFile('rejecttrade.html',{root:path.join(__dirname,'../dist/')});
        })
        .catch(errConnect => {
            // console.log('====================================');
            // console.log(`error rejecting the books trade:${errConnect}`);
            // console.log('====================================');
            logger.error(`error rejecting the books trade::${JSON.stringify(errConnect,null,2)}`);
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        });
    },
     /**
     * accepts the book trade
     * @param {*} request express request sent from the client
     * @param {*} response express response to be sent to the client
     */
    tradeAccept(request, response) {
        if (!request.query.tokentrade) {
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda005", reason: "NO TOKEN PROVIDED"}));
            return;
        }
        dbService.setUrl(request.app.MONGODB);
        dbService.connect().then(() => dbService.searchByID({collectionName: 'book_trades',queryParam: {_id: request.query.tokentrade}}))
            .then(resultsearchtrade => {
                // checks if it exists
                if (!resultsearchtrade.length) {
                    dbService.disconnect();
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda005", reason: "No trade with the token provided exists"}));
                    return;
                }
                //
                // checks the status of the trade
                if (resultsearchtrade[0].statustrade) {
                    dbService.disconnect();
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda005", reason: "That trade was already processed"}));
                    return;
                }
                /**
             * queries to the database for:
             * getting the books from the person who wants the book
             * search for the unique
             * updates the status of the trade
             * removes it from the user book list
             */
            Promise.all([dbService.search({collectionName: 'books',queryParam: {user: resultsearchtrade[0].tradedto}}),
                    dbService.searchUniqueSubDocument({
                        collectionName: 'books',
                        queryParam: [
                            {
                                $match: {
                                    'booklist.idbook': resultsearchtrade[0].bookid
                                }
                            }, 
                            {
                                $project: {
                                    booklist: {
                                        $filter: {
                                            input: '$booklist',
                                            as: 'itembook',
                                            cond: {
                                                $eq: ['$$itembook.idbook', resultsearchtrade[0].bookid]
                                            }
                                        }
                                    },
                                    _id: 0
                                }
                            }
                        ]
                    }),
                    dbService.updateById({collectionName: 'book_trades',queryParam: {dataselect: {item: request.query.tokentrade},datacriteria: {$set: {statustrade: 1}}}}),
                    dbService.updateData({
                        collectionName: 'books',
                        queryParam: {
                            dataselect: {
                                user: resultsearchtrade[0].bookowner
                            },
                            datacriteria: {
                                $pull: {
                                    booklist: {
                                        idbook: resultsearchtrade[0].bookid
                                    }
                                }
                            }

                        }
                    })

                ]).then(resultradedata => {
                    const bookTraded = resultradedata[1];
                    const infoBookTraded = bookTraded[0];
                    if (resultradedata[0].length) {
                        // pushes a new subdocument
                        dbService.updateData({
                            collectionName: 'books',
                            queryParam: {
                                dataselect: {
                                    user: resultsearchtrade[0].tradedto
                                },
                                datacriteria: {
                                    $addToSet: {
                                        booklist: {
                                            idbook: infoBookTraded.booklist[0].idbook,
                                            name: infoBookTraded.booklist[0].name,
                                            author: infoBookTraded.booklist[0].author,
                                            imgcover: infoBookTraded.booklist[0].imgcover,
                                            review: infoBookTraded.booklist[0].review
                                        }
                                    }
                                }
                            }
                        }).then(() => {
                            response.sendFile('resulttrade.html',{root:path.join(__dirname,'../dist/')});
                        }).catch(erraddtonewuser => {
                            dbService.disconnect();
                            logger.error(`error accept trade of the books:${JSON.stringify(erraddtonewuser,null,2)}`);
                            // console.log('====================================');
                            // console.log(`error accept trade of the books:${erraddtonewuser}`);
                            // console.log('====================================');
                            response.writeHead(500, {'Content-Type': 'application/json'});
                            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                        });
                    } else {
                        dbService.injectOneItem({collectionName: 'books',
                            data: {
                                user: resultsearchtrade[0].tradedto,
                                booklist: [
                                    {
                                        idbook: infoBookTraded.booklist[0].idbook,
                                        name: infoBookTraded.booklist[0].name,
                                        author: infoBookTraded.booklist[0].author,
                                        imgcover: infoBookTraded.booklist[0].imgcover,
                                        review: infoBookTraded.booklist[0].review
                                    }
                                ]
                            }
                        })
                        .then(() => {
                            response.status(200).send('../dist/resulttrade.html');
                        })
                        .catch(errInjectbook => {
                            dbService.disconnect();
                            logger.error(`Error injecting the book:${JSON.stringify(errInjectbook,null,2)}`);
                            // console.log('====================================');
                            // console.log(`error adding the books:${errInjectbook}`);
                            // console.log('====================================');
                            response.writeHead(500, {'Content-Type': 'application/json'});
                            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                        });
                    }
                }).catch(errupdatetrade => {
                    dbService.disconnect();
                    logger.error(`Error accept trade of the books:${JSON.stringify(errupdatetrade,null,2)}`);
                    // console.log('====================================');
                    // console.log(`error accept trade of the books:${errupdatetrade}`);
                    // console.log('====================================');
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                });
            })
        .catch(errorConnect => {
            logger.error(`Error connect accept trade of the books:${JSON.stringify(errorConnect,null,2)}`);
            // console.log('====================================');
            // console.log(`error BookController connect to db:${errorConnect}`);
            // console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        });

    }
};