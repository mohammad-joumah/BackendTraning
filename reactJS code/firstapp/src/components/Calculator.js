
const Multiplication = (data)=> {
    let {a,b} = data ,option="Multiply";
    return <h1 className="alert alert-primary" style={{"width":"60%"}}>Result {option} of {a}*{b} is: {a*b}</h1>
}
const Division = (data)=> {
    let {a,b,option} = data 
    return <h1 className="alert alert-primary" style={{"width":"60%"}}>Result {option} of {a}/{b} is: {a/b}</h1>
}

// subtraction
const Subtraction = (data)=> {
    let {a,b,option} = data 
    return <h1 className="alert alert-primary" style={{"width":"60%"}}>Result {option} of {a}-{b} is: {a-b}</h1>
}
// addition
const Addition = (data)=> {
    let {a,b,option} = data 
    return <h1 className="alert alert-primary" style={{"width":"60%"}}>Result {option} of {a}+{b} is: {a+b}</h1>
}

export {Multiplication, Division, Subtraction,Addition};