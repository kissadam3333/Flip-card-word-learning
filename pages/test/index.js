export default function Test() {


    const test =()=>{
        fetch('http://localhost:3000/api/tempDb', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body:JSON.stringify([1,2,3,4,5]),
          })
    }


    return(
        <button onClick={test}>POST</button>
    )
}