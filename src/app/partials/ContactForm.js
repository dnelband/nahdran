import { useEffect, useState } from "react";
import $ from 'jquery';

function ContactForm(props){

    const [ name, setName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ msg, setMsg ] = useState('');
    const [ isDone, setIsDone ] = useState(false);

    function submitMessage(){
        $.ajax({
            url:'/db/messages/',
            type:'POST',
            data:{name,email,msg}
        }).done(function(res) {
            setIsDone(true);
        })
    }


    return (
        <div className="contact-form">
            <input type="text" value={name} onChange={e => setName(e.target.value)}/>
            <input type="text" value={email} onChange={e => setEmail(e.target.value)}/>
            <textarea type="text" value={msg} onChange={e => setMsg(e.target.value)}></textarea>
            <button onClick={submitMessage}>Submit</button>
            {isDone ? "message sent!" : ""}
        </div>
    )
}

export default ContactForm;