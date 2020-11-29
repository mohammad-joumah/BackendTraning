import React, { Component } from "react"; 



class Counter extends Component{
    constructor(){
        super();
        this.state={
            count:0
        }
    }
    incremant=()=>{
        this.setState(()=>{
        return{
            count: this.state.count+1
            }
        })
    }
    decremant=()=>{
        if(this.state.count>0){
            this.setState(()=>{
            return{
                count: this.state.count-1
                }
            })
        }
        else return this.state.count
    }
    render(){
        return (<div className="container mt-5">
                    
                        <button type="submit" className="btn btn-danger" onClick={this.incremant}>
                            ^
                        </button>
                        <br/>
                        <button type="submit" className="btn btn-primary " onClick={this.decremant}>
                            v
                        </button>
                    
                    <h3 className="border border-primary p-1 mt-1 col-1">{this.state.count}</h3>
                    
                   
                </div>)
    }
}

export default Counter;