const httpService = require('./httpService'); 
const dbService=require('./dbFactory');
//const httpService = require('../src/server/httpService');
//const dbService = require('../src/server/dbFactory');
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
                                    bookowner: item.user,
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
                    console.log('====================================');
                    console.log(`error promise all searches:${JSON.stringify(errSearches,null,2)}`);
                    console.log('====================================');
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                })
            })
            .catch(err => {
                console.log('====================================');
                console.log(`error getting the books:${err}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
            })
    },
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
                        console.log('====================================');
                        console.log(`error adding the books:${err}`);
                        console.log('====================================');
                        response.writeHead(500, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                    })
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
                        console.log('====================================');
                        console.log(`error adding the books:${errInjectbook}`);
                        console.log('====================================');
                        response.writeHead(500, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                    })
                }
            })
            .catch(errconnect => {
                console.log('====================================');
                console.log(`error connect adding the books:${JSON.stringify(errconnect,null,2)}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
            })

    },
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
                    response.end(JSON.stringify({code: "fccda001", reason: "Book is currently being traded by another person"}));
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
                    /* console.log('====================================');
                    console.log(`Mail DATA INFO:${JSON.stringify(resultInfo,null,2)}`);
                    console.log('===================================='); */
                    httpService.sendMail(resultInfo).then(resultMail=>{
                        if (resultMail){
                            response.writeHead(200, {'Content-Type': 'application/json'});
                            response.end(JSON.stringify({code: "fccda005", reason: "TRADEREQUESTOK"}));
                            return;
                       }
                       response.writeHead(500, {'Content-Type': 'application/json'});
                       response.end(JSON.stringify({code: "fccda001", reason: "ERROR NOTIFICATION"}));
                    }).catch(errsendmail=>{
                        console.log('====================================');
                        console.log(`error sendmail the books:${JSON.stringify(errsendmail,null,2)}`);
                        console.log('====================================');
                        
                        response.writeHead(500, {'Content-Type': 'application/json'});
                        response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                    })
                })
                .catch(errorinjecttrade => {
                    dbService.disconnect();
                    console.log('====================================');
                    console.log(`error errorinjecttrade the books:${JSON.stringify(errorinjecttrade,null,2)}`);
                    console.log('====================================');
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                })
            }).catch(errordatatrade => {
                    //dbService.disconnect();
                console.log('====================================');
                console.log(`error trading the books:${JSON.stringify(errordatatrade,null,2)}`);
                console.log('====================================');
                response.writeHead(500, {'Content-Type': 'application/json'});
                response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
            })
        })
        .catch(errorConnect => {
            console.log('====================================');
            console.log(`error trading the books:${errorConnect}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        })
    },
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
            console.log('====================================');
            console.log(`error rejecting the books trade:${errConnect}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        })
    },
    tradeAccept(request, response) {
        if (!request.query.tokentrade) {
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda005", reason: "NO TOKEN PROVIDED"}));
            return;
        }
        
        dbService.setUrl(request.app.MONGODB);
        dbService.connect().then(() => dbService.searchByID({collectionName: 'book_trades',queryParam: {_id: request.query.tokentrade}}))
            .then(resultsearchtrade => {
               /*  console.log('====================================');
                console.log(`tradebook accept result of query search trades:${JSON.stringify(resultsearchtrade, null, 2)}`);
                console.log('====================================\n\n\n\n\n'); */
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
                    /* console.log('====================================');
                    console.log(`accept trade search books by id:${JSON.stringify(resultradedata, null, 2)}`);
                    console.log('===================================='); */
                    const bookTraded = resultradedata[1];
                    const infoBookTraded = bookTraded[0];
                    /* console.log('====================================');
                    console.log(`book in question:${JSON.stringify(bookTraded, null, 2)} \n infoBook:${JSON.stringify(infoBookTraded, null, 2)}`);
                    console.log('===================================='); */
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
                            /* console.log('====================================');
                            console.log(`data added:${JSON.stringify(resultupdate)}`);
                            console.log('===================================='); */
                            response.sendFile('resulttrade.html',{root:path.join(__dirname,'../dist/')});
                        }).catch(erraddtonewuser => {
                            dbService.disconnect();
                            console.log('====================================');
                            console.log(`error accept trade of the books:${erraddtonewuser}`);
                            console.log('====================================');
                            response.writeHead(500, {'Content-Type': 'application/json'});
                            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                        })
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
                            /* console.log('====================================');
                            console.log(`data added:${JSON.stringify(resultdata)}`);
                            console.log('===================================='); */
                            response.status(200).send('../dist/resulttrade.html');
                        })
                        .catch(errInjectbook => {
                            dbService.disconnect();
                            console.log('====================================');
                            console.log(`error adding the books:${errInjectbook}`);
                            console.log('====================================');
                            response.writeHead(500, {'Content-Type': 'application/json'});
                            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                        })
                    }
                }).catch(errupdatetrade => {
                    dbService.disconnect();
                    console.log('====================================');
                    console.log(`error accept trade of the books:${errupdatetrade}`);
                    console.log('====================================');
                    response.writeHead(500, {'Content-Type': 'application/json'});
                    response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
                })
            })
        .catch(errorConnect => {
            console.log('====================================');
            console.log(`error BookController connect to db:${errorConnect}`);
            console.log('====================================');
            response.writeHead(500, {'Content-Type': 'application/json'});
            response.end(JSON.stringify({code: "fccda001", reason: "Server Internal Error"}));
        })

    }
};