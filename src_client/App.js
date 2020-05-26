import React, { Component } from "react";
import axios from "axios";

class App extends Component {
    componentDidMount() {
        axios
            .get("translateString")
            .then(res => {
                console.log("res.data.response.", res.data.response);
            })
            .catch(err => console.log("err", err));
    }

    render() {
        return <div>123</div>;
    }
}

export default App;
