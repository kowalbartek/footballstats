/*
Group: 16

Author: Conor Phelan/17745019 for CS353 Project

This code works, but due to the lack of data to display,
it doesn't function yet. I managed to get it to work with a separate
array I had of a list of songs, but for sports statistics, I couldn't find
an appropriate array/database to pair the function with.
*/

import React, { Component } from "react";
import {statistics} from "./data/tableLog.json";
const localStatistic = statistics;

class App extends Component {
    constructor(props) {
        super(props);
        console.log("In the constructor App comp");
        this.state = {searchTerm: "", len: 0, globalArray: localStatisticArray };
        this.onSearchFormChange = this.onSearchFormChange.bind(this);
        this.handleResetClick=this.handleResetClick.bind(this);
    } // end constructor

    onSearchFormChange(event){
        this.setState({searchTerm: event.target.value});
        let sTerm = event.target.value; //typed in value
        let numChars = sTerm.length;
        this.setState({len: numChars});
    }

    handleResetClick()
    {
        this.setState({searchTerm: "", len: 0, globalArray: localStatisticArray});
    }
    render() {
        return (
            <div className="App">

                <h1>CS385 Player and Team Search App</h1>
                Searching for:
                <b>{this.state.searchTerm}</b> There are{" "}
                <b>[{this.state.len}]</b> characters typed.


                <SearchForm //Component A
                    searchTerm={this.state.searchTerm}
                    onChange={this.onSearchFormChange}
                />
                <SearchResults //Component B
                    searchTerm={this.state.searchTerm}
                    globalArray={this.state.globalArray}
                />
                <Reset buttonHandler = {this.handleResetClick}/>
            </div>
        ); // end of return statement
    } // end of render function
} // end of class

//**************************************************//
class SearchForm extends Component { //Component A
    render() {
        const searchTermFromProps = this.props.searchTerm;
        const onChangeFromProps = this.props.onChange;

        return (
            <div className="SearchFromForm">
                <hr />
                <form>
                    <b> Search here: </b>
                    <input
                        type="text"
                        value={searchTermFromProps}
                        onChange={onChangeFromProps}
                    />
                </form>
            </div>
        );
    }
} // close Componen tA / Search Form component


//**************************************************//
class SearchResults extends Component {
    //Filter Function to perform search
    searchFilterFunction(searchTerm){
        return function (searchObject){
            //Convert search input to lower case for String matching
            //let id = searchObject.full_id; //Number so no need to lower case
            //Example data types (At the time of writing this, we have no available data)
            let name = searchObject.name.toLowerCase();
            let position = searchObject.position.toLowerCase();
            let goals = searchObject.goals; //Number so no need to lower case
            let age = searchObject.age; //Number so no need to lower case
            let worth = searchObject.worth; //Number, but will also include a currency character so it should be a String

            return(
                (searchTerm !== "" &&
                    (name.includes(searchTerm.toLowerCase()) ||
                        position.includes(searchTerm.toLowerCase())))
                        //Insert more here if needed
                    );//This should be correct. Error only appeared when I added example variables
        }
    }

    render() {
        const arrayPassedAsParameter = this.props.globalArray;
        const searchTermFromProps = this.props.searchTerm;

        //calculate how many elements are in the array after filter is applied
        let numberResults = arrayPassedAsParameter.filter(
            this.searchFilterFunction(searchTermFromProps)).length;

        return (
            <div className="SearchResults">
                <hr />
                <h1>Search Results: </h1>

                {numberResults} Results
                <p/>
                <hr/>

                {arrayPassedAsParameter
                    .filter(this.searchFilterFunction(searchTermFromProps))
                    .map((a) => (
                        <div key={a.id}>
                            <b>{a.name}</b>, <i>{a.position}</i>, <i>{a.goals}</i>, <i>{a.age}</i>, <i>{a.worth}</i> //Again, these are just examples - it can be changed or more can be added
                        </div>
                    ))}
            </div>
        );
    }
} // close the ComponentB component

class Reset extends Component {
    render() {
        //Connect the child reset component to parent class
        const buttonHandler = this.props.buttonHandler;
        return (
            <div className="ResetComponent">
                <button onClick = {buttonHandler}> Clear Search </button>
            </div>
        ); // end of return statement
    } // end of render function
} // end of class

export default App;