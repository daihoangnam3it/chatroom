const socket=io();

const messPublic=document.getElementById('mess');
const sendMess=document.getElementById('send');
const boxMess=document.querySelector('.content');
const boxActive=document.querySelector('.box--active');
const boxChat=document.querySelector('.box----chat');
const boxContent=document.querySelector('.box--content');
const boxRoom=document.querySelector('.box--room');
const namePublic=document.getElementById('nameHello');
const idPublic=document.getElementById('userid');
const idOther=document.getElementById('idother');
const createRoom=document.getElementById('create');
const formAddRoom=document.getElementById('add--room');
const nameRoom=document.getElementById('nameRoom');
const body=document.querySelector('body');
// var s=toString(nameRoom.value)
formAddRoom.addEventListener('submit',function(e){
    e.preventDefault();
    var newRoom={
        nameRoom:nameRoom.value
    }
    // const formData=new FormData(this);
    console.log(nameRoom.value);
    fetch('/users/room--add',{
        method:'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body:JSON.stringify(newRoom)
    }).then(res=>res.text()).then(data=>{
        fetch('/users/room/'+idPublic.value).then(rese=> rese.json()).then(doc=>{
            var a=[];
            console.log(doc);
            doc.forEach(el=>{
                a.push(`<a href="/users/room/group/${el._id}">${el.name}</a> <br>`)
            })
            boxRoom.innerHTML=a.join(' ');
            // socket.emit('list--room',data)
            
        })
    });
    
})

fetch('/users/room/'+idPublic.value).then(res=> res.json()).then(data=>{
    var a=[];
    console.log(data);
    data.forEach(el=>{
        a.push(`<a href="/users/room/group/${el._id}">${el.name}</a> <br>`)
    })
    boxRoom.innerHTML=a.join(' ');
    // socket.emit('list--room',data)
    
})
// socket.on('sever--room',data=>{
//      data.forEach(el=>{
//         const s=document.createElement('div');
//         s.classList.add('list--room');
//         let inner=``;
//         inner=`<span>${el.name}</span>`
        
//         // let inner=`${el.id}`;
//         s.innerHTML=inner;
//         boxActive.appendChild(s);
//     })
// })

socket.emit('signin',{
    id:idPublic.value,
    username:namePublic.innerHTML,
})
socket.on("active",data=>{
    boxActive.innerHTML='';
    data.forEach(el=>{
        const s=document.createElement('div');
        s.classList.add('active--list');
        let inner=``;
        if(el.id!=idPublic.value&&el.username!=namePublic.innerHTML){
            inner=`<li href="/users/${el.id}" id="${el.id}" style="cursor:pointer;">${el.username}</li>`;
            
        }
        
        // let inner=`${el.id}`;
        s.innerHTML=inner;
        boxActive.appendChild(s);
    })
    // const userActive=document.querySelectorAll('.user--active');
    // userActive.forEach(el=>{
    //     el.addEventListener('click',()=>{
    //         var a=el.getAttribute('id');
    //         fetch('/users/chat/'+a).then(res=>res.text()).then(data=>{
    //             console.log(data);
    //             // // box.innerHTML=data;
    //             // box.style.display='none';
    //             // boxContent.classList.remove('text--box');
    //             // boxContent.classList.add('user--text');
    //             // document.querySelector('.user--text').innerHTML=data;
    //             boxChat.innerHTML=data
                 
    //         });
    //     })
    // })
})

sendMess.addEventListener('click',()=>{
    socket.emit('send--mess',{
        id:idPublic.value,
        username:namePublic.innerHTML,
        mess:messPublic.value,
    });
    // alert(mess.value);
    const s=document.createElement('div');
    s.classList.add('text');
    
    let inner=`<h2>${namePublic.innerHTML}: ${messPublic.value}</h2>`;
    s.innerHTML=inner;
    boxMess.appendChild(s);
    messPublic.value='';
    // console.log(name.innerHTML)
})

socket.on('sever--send',data=>{
    console.log('nhận được: ' + data);
    const s=document.createElement('div');
    s.classList.add('text');
    let inner=`<h2>${data.username}: ${data.mess}</h2>`;
    s.innerHTML=inner;
    boxMess.appendChild(s);
})




