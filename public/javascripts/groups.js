const socket=io();

const infoClick=document.querySelectorAll('.info');

const idGroup=document.getElementById('idGroup');
var inputAddUser=document.getElementById('addUserInput')
var btnSendMess=document.getElementById('sendMess');
const inputMessUser=document.getElementById('messUser');
const idPublic=document.getElementById('idPublic');
const namePublic=document.getElementById('namePublic');
const messUser=document.getElementById('messUser');
const notificationMess=document.querySelector('.notification--mess');
const imgInput=document.getElementById('inputSendImg');
const imgDemo=document.getElementById('imgDemo');
var btnAddUser=document.getElementById('addUserBtn');
const boxChat=document.querySelector('.boxChat--content');
const informationBox=document.querySelector('.information--box');
const boxActive=document.querySelector('.list--item');

boxChat.scrollTop=boxChat.scrollHeight


socket.emit('signin',{
    id:idPublic.value,
    username:namePublic.innerHTML,
})
socket.emit('signin--Room',{
    idGroup:idGroup.innerHTML,
    id:idPublic.value,
    username:namePublic.innerHTML,
})
socket.on('onl--room',data=>{
    boxActive.innerHTML='';

    console.log(data);
    data.forEach(el=>{
        if(el.idGroup==idGroup.innerHTML){
            console.log(el);
            const s=document.createElement('div');
        s.classList.add('item');
        let inner=``;
        if(el.id!=idPublic.value&&el.username!=namePublic.innerHTML){
            inner=`
            <span class="info" id="${el.id}">${el.username}</span>
          `
        }
        // let inner=`${el.id}`;
        s.innerHTML=inner;
        boxActive.appendChild(s);
        const infoClick=document.querySelectorAll('.info');
        infoClick.forEach(el=>{
            el.addEventListener('click',()=>{
                var idInfo=el.getAttribute('id');
                let load=`<div class="loadInfo">
                <div class="loadInfo__box">
                <span id="idUserClick">Đang tải</span>
                <img
                  src="https://i.pinimg.com/564x/ad/34/9d/ad349d882c734c7dc7a076ada105aa5a.jpg"
                  alt=""
                />
                <span id="nameUserClick">Đang tải</span>
                </div>
            </div>`;
                informationBox.innerHTML=load;
                fetch('/users/info/'+idInfo).then(res=>res.json()).then(info=>{
                    console.log(info)
                    let inner=`<span id="idUserClick">${info._id}</span>
                    ${info.img!=null ? `<img src="${info.img}" alt="">`:`<img
                    src="https://i.pinimg.com/564x/e0/64/68/e0646826d44cac5d804603d687b16e23.jpg"
                    alt=""
                  />`}
                    <span id="nameUserClick">${info.nickname}</span>`
                    
                    informationBox.innerHTML=inner;
                })
            })
        })
        }
       
    })
    
})

socket.on('active--room',data=>{
    boxActive.innerHTML='';
    data.forEach(el=>{
        const s=document.createElement('div');
        s.classList.add('item');
        let inner=``;
        if(el.id!=idPublic.value&&el.username!=namePublic.innerHTML){
            inner=`
            <span class="info" id="${el.id}">${el.username}</span>
          `
        }
        // let inner=`${el.id}`;
        s.innerHTML=inner;
        boxActive.appendChild(s);
        const infoClick=document.querySelectorAll('.info');
        infoClick.forEach(el=>{
            el.addEventListener('click',()=>{
                var idInfo=el.getAttribute('id');
                let load=`Dang tai du lieu`;
                informationBox.innerHTML=load;
                fetch('/users/info/'+idInfo).then(res=>res.json()).then(info=>{
                    console.log(info)
                    let inner=`<span id="idUserClick">${info._id}</span>
                    ${info.img!=null ? `<img src="${info.img}" alt="">`:`<img
                    src="https://i.pinimg.com/564x/e0/64/68/e0646826d44cac5d804603d687b16e23.jpg"
                    alt=""
                  />`}
                    <span id="nameUserClick">${info.nickname}</span>`
                    
                    informationBox.innerHTML=inner;
                })
            })
        })
    })
})

infoClick.forEach(el=>{
    el.addEventListener('click',()=>{
        var idInfo=el.getAttribute('id');
        var idInfo=el.getAttribute('id');
            let load=`Dang tai du lieu`;
            informationBox.innerHTML=load;
            fetch('/users/info/'+idInfo).then(res=>res.json()).then(info=>{
                console.log(info)
                let inner=`<span id="idUserClick">${info._id}</span>
                ${info.img!=null ? `<img src="${info.img}" alt="">`:`<img
                src="https://i.pinimg.com/564x/e0/64/68/e0646826d44cac5d804603d687b16e23.jpg"
                alt=""
              />`}
                <span id="nameUserClick">${info.nickname}</span>`
                
                informationBox.innerHTML=inner;
            })
    })
})




imgInput.addEventListener('change',(e)=>{
    const file=document.getElementById('inputSendImg').files;
    if(file.length>0){
        const reader=new FileReader();
        reader.onload=el=>{
            imgDemo.setAttribute('src',el.target.result)
        }
        reader.readAsDataURL(file[0]);
    }
})
var b64;
imgDemo.onload=function(){
    var canvas=document.createElement('canvas');
    var ctx=canvas.getContext('2d');
    canvas.height=this.naturalHeight;
    canvas.width=this.naturalWidth;
    ctx.drawImage(this,0,0);
    b64=canvas.toDataURL('image/jpeg');
    // console.log(data);
    
}


// Thêm thành viên nè
btnAddUser.addEventListener('click',()=>{
    var newUser={
        name:inputAddUser.value
    }
// console.log(inputAddUser.value)
// console.log(newUser);

    fetch('/users/room/group/'+idGroup.innerHTML,{
        method:'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body:JSON.stringify(newUser)
    }).then(res=>res.json()).then(data=>{
        fetch('/users/room/group-user/'+idGroup.innerHTML).then(res=>res.json()).then(data=>{
            alert('Đã thêm');
        });
    });
    inputAddUser.value='';
})
fetch('/users/room/group-user/'+idGroup.innerHTML).then(res=>res.json()).then(data=>console.log(data));


window.addEventListener('click',()=>{
    var data=idGroup.innerHTML;
    socket.emit('notification--end--mess',data)
   
})
messUser.addEventListener('keydown',()=>{
    var data=idGroup.innerHTML;
    socket.emit('notification--mess',data)
})

socket.on('sever--notification--mess',data=>{
    if(data==idGroup.innerHTML){
        notificationMess.style.opacity=1;
        notificationMess.style.visibility='visible';
    }
})
socket.on('sever--notification--end--mess',data=>{
    if(data=idGroup.innerHTML){
        notificationMess.style.opacity=0;
        notificationMess.style.visibility='hidden';
    }
})






// Chat nè
// Gửi tin nhắn lên nè

btnSendMess.addEventListener('click',()=>{
    if(inputMessUser.value=='' && inputSendImg.value==null){
        alert('Nhajap noi dung tin nhan');
    }else{
    var newMess={
        idGroup:idGroup.innerHTML,
        idUser:idPublic.value,
        name:namePublic.innerHTML,
        mess:inputMessUser.value,
        img:b64,
        createAt:Date.now()
    }
    socket.emit('user--send--mess-in--group',newMess)
    const s=document.createElement('div');
    s.classList.add('chat__me');
    let inner=`<span class="me--name info" id="${idPublic.value}" >${namePublic.innerHTML}</span>
    <p class="me--mess">
       ${inputMessUser.value}
    </p>
    ${b64!=null?`<img src="${b64}" alt="">`:''}
    `
    inputMessUser.value='';
    s.innerHTML=inner;
    boxChat.appendChild(s);
    boxChat.scrollTop=boxChat.scrollHeight
    const infoClick=document.querySelectorAll('.info');
    inputMessUser.value=null;
    imgDemo.setAttribute('src','');
    inputSendImg.value=null;
    infoClick.forEach(el=>{
        el.addEventListener('click',()=>{
            var idInfo=el.getAttribute('id');
            let load=`Dang tai du lieu`;
            informationBox.innerHTML=load;
            fetch('/users/info/'+idInfo).then(res=>res.json()).then(info=>{
                console.log(info)
                let inner=`<span id="idUserClick">${info._id}</span>
                ${info.img!=null ? `<img src="${info.img}" alt="">`:`<img
                src="https://i.pinimg.com/564x/e0/64/68/e0646826d44cac5d804603d687b16e23.jpg"
                alt=""
              />`}
                <span id="nameUserClick">${info.nickname}</span>`
                
                informationBox.innerHTML=inner;
            })
        })
    })
    imgDemo.value=null;
    b64=null;
    }
})


// Nhận tin nhắn nè
socket.on('sever--send--mess-to-group',data=>{
    if(data.idGroup==idGroup.innerHTML){

    console.log('da nhan duoc tin nhan tu sever');
    const s=document.createElement('div');
    s.classList.add('chat__friend');
    let inner=`<span class="friend--name info" id="${data.idUser}" >${data.name}</span>
    <p class="friend--mess">
    ${data.mess}
    </p>
    ${data.img != null ?`<img src="${data.img}" alt="">`:''}
    `
    s.innerHTML=inner;
    boxChat.appendChild(s);
    boxChat.scrollTop=boxChat.scrollHeight
    const infoClick=document.querySelectorAll('.info');

    infoClick.forEach(el=>{
        el.addEventListener('click',()=>{
            var idInfo=el.getAttribute('id');
            let load=`Dang tai du lieu`;
            informationBox.innerHTML=load;
            fetch('/users/info/'+idInfo).then(res=>res.json()).then(info=>{
                console.log(info)
                let inner=`<span id="idUserClick">${info._id}</span>
                ${info.img!=null ? `<img src="${info.img}" alt="">`:`<img
                src="https://i.pinimg.com/564x/e0/64/68/e0646826d44cac5d804603d687b16e23.jpg"
                alt=""
              />`}
                <span id="nameUserClick">${info.nickname}</span>`
                
                informationBox.innerHTML=inner;
            })
        })
    })
}
})