//import React, {Component} from 'react';
import React from 'react';

import '../../Assets/stylesheets/base.scss';


const NotFound=()=>{
    return (
        <div className="container-fluid">
            <div className="notFoundText">
                404...404...Did i read that right?<br/>Someone took a wrong left turn somewhere....
                <p/>
                As your got here let me teach you something to ease your mind of things.<br/>
                Namely some nice booze combos to try out.
            </div>
            <div className="voffset5"/>
            <div className="row">
                <div className="col-xs-6 col-md-4">
                    <div className="panel panel-warning">
                        <div className="panel-heading">
                            <div className="panel-title">
                                <h4>Side Car</h4>
                            </div>
                        </div>
                        <div className="panel-body">
                            <ul>
                                <li>5 cl cognac</li>
                                    <li>2 cl triple sec</li>
                                    <li>2 cl lemon juice</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6 col-md-4">
                    <div className="panel panel-warning">
                        <div className="panel-heading">
                            Sex on the beach
                        </div>
                        <div className="panel-body">
                            <ul>
                                 <li>4 cl vodka</li>
                                 <li>2 cl peach schnapps</li>
                                 <li>2 cl orange juice</li>
                                 <li>4 cl cranberry juice</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6 col-md-4">
                    <div className="panel panel-warning">
                        <div className="panel-heading">
                            Black russian
                        </div>
                        <div className="panel-body">
                            <ul>
                                 <li>5 cl vodka</li>
                                <li>2 cl coffee liqueur</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-xs-6 col-md-4">
                    <div className="panel panel-warning">
                        <div className="panel-heading">
                            Singapore Sling
                        </div>
                        <div className="panel-body">
                            <ul>
                                 <li>4 cl gin</li>
                                 <li>1.5 cl cherry brandy</li>
                                 <li>.75 cl Cointreau</li>
                                 <li>.75 cl DOM Bénédictine</li>
                                 <li>1 cl Grenadine</li>
                                 <li>12 cl pineapple juice</li>
                                 <li>1.5 cl lime juice</li>
                                 <li>1 dash Angostura bitters</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6 col-md-4">
                    <div className="panel panel-warning">
                        <div className="panel-heading">
                            Between the Sheets
                        </div>
                        <div className="panel-body">
                            <ul>
                                 <li>3 cl white rum</li>
                                <li>3 cl cognac</li>
                                <li>3 cl triple sec</li>
                                <li>2 cl fresh lemon juice</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6 col-md-4">
                    <div className="panel panel-warning">
                        <div className="panel-heading">
                            Screwdriver
                        </div>
                        <div className="panel-body">
                            <ul>
                                 <li>5 cl vodka</li>
                                <li>2 cl orange juice</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
};
// class NotFound extends Component {

//     render() {
//         return (
//             <div className="container-fluid">
//                 <div className="notFoundText">
//                     404...404...Did i read that right?<br/>Someone took a wrong left turn somewhere....
//                     <p/>
//                     As your got here let me teach you something to ease your mind of things.<br/>
//                     Namely some nice booze combos to try out.
//                 </div>
//                 <div className="voffset5"/>
//                 <div className="row">
//                     <div className="col-xs-6 col-md-4">
//                         <div className="panel panel-warning">
//                             <div className="panel-heading">
//                                 <div className="panel-title">
//                                     <h4>Side Car</h4>
//                                 </div>
//                             </div>
//                             <div className="panel-body">
//                                 <ul>
//                                     <li>5 cl cognac</li>
//                                         <li>2 cl triple sec</li>
//                                         <li>2 cl lemon juice</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-xs-6 col-md-4">
//                         <div className="panel panel-warning">
//                             <div className="panel-heading">
//                                 Sex on the beach
//                             </div>
//                             <div className="panel-body">
//                                 <ul>
//                                      <li>4 cl vodka</li>
//                                      <li>2 cl peach schnapps</li>
//                                      <li>2 cl orange juice</li>
//                                      <li>4 cl cranberry juice</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-xs-6 col-md-4">
//                         <div className="panel panel-warning">
//                             <div className="panel-heading">
//                                 Black russian
//                             </div>
//                             <div className="panel-body">
//                                 <ul>
//                                      <li>5 cl vodka</li>
//                                     <li>2 cl coffee liqueur</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-xs-6 col-md-4">
//                         <div className="panel panel-warning">
//                             <div className="panel-heading">
//                                 Singapore Sling
//                             </div>
//                             <div className="panel-body">
//                                 <ul>
//                                      <li>4 cl gin</li>
//                                      <li>1.5 cl cherry brandy</li>
//                                      <li>.75 cl Cointreau</li>
//                                      <li>.75 cl DOM Bénédictine</li>
//                                      <li>1 cl Grenadine</li>
//                                      <li>12 cl pineapple juice</li>
//                                      <li>1.5 cl lime juice</li>
//                                      <li>1 dash Angostura bitters</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-xs-6 col-md-4">
//                         <div className="panel panel-warning">
//                             <div className="panel-heading">
//                                 Between the Sheets
//                             </div>
//                             <div className="panel-body">
//                                 <ul>
//                                      <li>3 cl white rum</li>
//                                     <li>3 cl cognac</li>
//                                     <li>3 cl triple sec</li>
//                                     <li>2 cl fresh lemon juice</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col-xs-6 col-md-4">
//                         <div className="panel panel-warning">
//                             <div className="panel-heading">
//                                 Screwdriver
//                             </div>
//                             <div className="panel-body">
//                                 <ul>
//                                      <li>5 cl vodka</li>
//                                     <li>2 cl orange juice</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
            
//         );
//     }
// }

export default NotFound;