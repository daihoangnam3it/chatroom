var socket=io();

const inputSendImg= document.getElementById('inputSendImg');
const imgShow=document.getElementById('imgShow');
const removeImg=document.querySelector('.remove--img');
var boxChat=document.querySelector('.box--chat');
var idOne=document.getElementById('idone')
var idTwo=document.getElementById('idtwo')
var boxActive=document.querySelector('.main--userActive--box');
var idUser=document.getElementById('idUser');
var sendMess=document.getElementById('sendMess');
var nameUser=document.getElementById('nameUser');
var messUser=document.getElementById('messUser');
var informationBox=document.querySelector('.information--box');
var notificationMess=document.querySelector('.notification--mess');
idOne.value='';
idTwo.value='';
//thông báo đang viết tin nè
messUser.addEventListener('keydown',()=>{
    var data={
        idOne:idOne.value,
        idTwo:idTwo.value
    }
    socket.emit('notification--mess',data);
})
socket.on('sever--notification--mess',data=>{
    if((data.idOne==idOne.value ||data.idOne==idTwo.value) && (data.idTwo==idTwo.value || data.idTwo == idOne.value)){
        notificationMess.style.opacity=1;
        notificationMess.style.visibility='visible';
    }
})
window.addEventListener('click',()=>{
    var data={
        idOne:idOne.value,
        idTwo:idTwo.value
    }
    socket.emit('notification--end--mess',data)
   
})
socket.on('sever--notification--end--mess',data=>{
    if((data.idOne==idOne.value ||data.idOne==idTwo.value) && (data.idTwo==idTwo.value || data.idTwo == idOne.value)){
        notificationMess.style.opacity=0;
        notificationMess.style.visibility='hidden';
    }
})
socket.emit('signin',{
    id:idUser.value,
    username:nameUser.innerHTML,
})

inputSendImg.addEventListener('change',function(){
    const file=inputSendImg.files;
    if(file.length>0){
        const reader=new FileReader();
        reader.onload=el=>{
            imgShow.setAttribute('src',el.target.result);
        }
        reader.readAsDataURL(file[0]);
    }
})
var b64;
imgShow.onload=function(){
    var canvas=document.createElement('canvas');
    var ctx=canvas.getContext('2d');
    canvas.height=this.naturalHeight;
    canvas.width=this.naturalWidth;
    ctx.drawImage(this,0,0);
    b64=canvas.toDataURL('image/jpeg');
    // console.log(data);
    
}
removeImg.addEventListener('click',()=>{
    inputSendImg.value=null;
    imgShow.setAttribute('src',"");
    b64=null;
})


socket.on("active",data=>{
    boxActive.innerHTML='';
    data.forEach(el=>{
        if(el.id!=idUser.value&&el.username!=nameUser.innerHTML){
        const s=document.createElement('div');
        s.classList.add('item--Active');
        let inner=``;
            inner=`<span class="user--active" id="${el.id}" style="cursor:pointer;">${el.username}</span>`; 
            // let inner=`${el.id}`;
            s.innerHTML=inner;
            boxActive.appendChild(s);
        }
    })
    var userActive=document.querySelectorAll('.user--active');
    userActive.forEach(el=>{
        el.addEventListener('click',()=>{
            boxChat.innerHTML='';
            boxChat.innerHTML=`<div class="loadPage">
            <img src="https://i.pinimg.com/564x/44/90/33/449033565886bd9dfebcb925efa0c1e8.jpg" alt="">
          </div>`
            var idLink=el.getAttribute('id');
            // alert(idLink);
            let inner= ``;
            fetch('/users/chat--w/'+idLink).then(res=>res.json()).then(data=>{
                idOne.value=data.idOther;
                idTwo.value=data.idUser;
                data.content.forEach(el=>{                    
                    boxChat.innerHTML=''; 
                    boxChat.scrollTop=boxChat.scrollHeight;

                    el.content.forEach(item=>{
                        // console.log(item.iduser);
                        if(item.iduser==idUser.value){
                            const s=document.createElement('div');
                            s.classList.add('chat--me');
                            let inner =`
                            <span class="me--name">${item.name}</span>
                            <p class="me--mess">
                                ${item.mess}
                            </p>
                            ${item.img!=null?`<img src="${item.img}" alt="anh">`:' '}
                            `
                             s.innerHTML=inner;
                             boxChat.appendChild(s);
                            boxChat.scrollTop=boxChat.scrollHeight;
                        }else{
                            const s=document.createElement('div');
                            s.classList.add('chat--friend');
                            let inner =
                            `
                            <span class="friend--name">${item.name}</span>
                            <p class="friend--mess">
                                ${item.mess}
                            </p>
                                ${item.img!=null?`<img src="${item.img}" alt="anh">`:' '}

                            `
                            s.innerHTML=inner;
                            boxChat.appendChild(s);
                            boxChat.scrollTop=boxChat.scrollHeight;

                         

                        }
                    })
                })
            });
            fetch('/users/info/'+idLink).then(res=>res.json()).then(info=>{
                let inner=`<span class="userId">${info._id}</span>
                ${info.img!=null ? `<img src="${info.img}" alt="">`:`<img
                src="https://i.pinimg.com/564x/e0/64/68/e0646826d44cac5d804603d687b16e23.jpg"
                alt=""
              />`}
                <span class="userName">${info.nickname}</span>`
                
                informationBox.innerHTML=inner;
            })
        })

    })
    
})





// Gửi tin nhắn qua lại nèeeeeeee

sendMess.addEventListener('click',()=>{
    if(idOne.value == '' || idTwo.value == ''){
        alert('Ko có đối tượng để nhắn bạn ơi')
    
    }else{
        if(messUser.value == '' && inputSendImg.value==null){
            alert('Nhập tin nhắn bạn ơi');
        }else{
            socket.emit('priva--mess',{
                name:nameUser.innerHTML,
                idtwo:idOne.value,
                idone:idTwo.value,
                mess:messUser.value,
                img:b64,
                createAt:Date.now()
            })
            socket.emit('send--mess-pri',{idOne:idOne.value,idTwo:idTwo.value,mess:messUser.value,img:b64,name:nameUser.innerHTML})
            const s=document.createElement('div');
            s.classList.add('chat--me');
            let inner=`
            <span class="me--name info">${nameUser.innerHTML}</span>
            <p class="me--mess"> ${messUser.value}</p>
            ${b64!=null?`<img src="${b64}" > `:''}
            `
            s.innerHTML=inner;
            boxChat.appendChild(s);
            boxChat.scrollTop=boxChat.scrollHeight;

            messUser.value='';
            imgShow.setAttribute('src','');
            inputSendImg.value=null;
        }
    }
    b64=null;
})

// Nhận tin nhăn nè
socket.on('sever--send--mess--prive',data=>{
    if((data.idOne==idOne.value ||data.idOne==idTwo.value) && (data.idTwo==idTwo.value || data.idTwo == idOne.value)){
        const s=document.createElement('div');
        s.classList.add('chat--friend');
        let inner=`
        <span class="friend--name">${data.name}</span>
        <p class="friend--mess"> ${data.mess}</p>
        ${data.img!=null?`<img src="${data.img}" > `:''}
        `
          s.innerHTML=inner;
          boxChat.appendChild(s);
          boxChat.scrollTop=boxChat.scrollHeight;


    }
  })


