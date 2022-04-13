import React from 'react'
import './SearchBar.css'

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.handleTermCharge = this.handleTermCharge.bind(this);
        this.state = {term: 'Enter A Song, Album, or Artist'}
    }
    search() {
        this.props.onSearch(this.state.term);
    }

    handleTermCharge(event) {
        this.setState({term: event.target.value})
    }

    render() {
        return (
        <div className="SearchBar">
            <input placeholder= {this.state.term} onChange = {this.handleTermCharge}/>
            <button className="SearchButton" onClick = {this.search} >SEARCH</button>
        </div>
        );
    }
}

export default SearchBar;