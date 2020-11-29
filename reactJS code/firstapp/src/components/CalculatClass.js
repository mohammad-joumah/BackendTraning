import React from "react";
class MultiplicationC extends React.Component {
    constructor() {
        super()
        this.a=20
        this.b=5
        this.option="Multiply"
    }
   render(){
       console.log(this.props)
    return <h1 className="alert alert-success" style={{"width":"60%"}}>Result {this.option} of {this.props.data.a}*{this.props.data.b} is: {this.props.data.a*this.props.data.b}</h1>
    }
}
// Division
class DivisionC extends React.Component  {
    constructor() {
        super()
        this.a=20
        this.b=5
        this.option="Division"
    }
   render(){
    return <h1 className="alert alert-success" style={{"width":"60%"}}>Result {this.option} of {this.a}/{this.b} is: {this.a/this.b}</h1>
    }
}


// subtraction
class SubtractionC extends React.Component  {
    constructor() {
        super()
        this.a=20
        this.b=5
        this.option="Subtraction"
    }
   render(){
    return <h1 className="alert alert-success" style={{"width":"60%"}}>Result {this.option} of {this.a}-{this.b} is: {this.a-this.b}</h1>
    }
}

// addition
class AdditionC extends React.Component  {
    constructor() {
        super()
        this.a=20
        this.b=5
        this.option="Addition"
    }
   render(){
    return <h1 className="alert alert-success" style={{"width":"60%"}}>Result {this.option} of {this.a}+{this.b} is: {this.a+this.b}</h1>
    }
}


export {MultiplicationC, DivisionC, SubtractionC,AdditionC};