const socket=io();
const boxChat=document.querySelector('.content--chat');
const addRoom=document.getElementById('create');
const listGroup=document.querySelector('.list--group');
const idPublic=document.getElementById('userid');
const namePublic=document.getElementById('nameHello');
const nameRoom=document.getElementById('nameRoom');
const sendMess=document.getElementById('sendMess');
const messPublic=document.getElementById('messUser');
const boxMess=document.querySelector('.content--chat');
const imgFile=document.getElementById('file');
const imgDemo=document.getElementById('imgDemo');
const getIdUser=document.querySelectorAll('.info');
const boxInfo=document.querySelector('.other--information');
const notifiChat=document.querySelector('.notification--chat');
window.addEventListener('click',()=>{
    socket.emit('notification--end--mess-r','Send mess')
   
})
messPublic.addEventListener('keydown',()=>{
    socket.emit('notification--mess-r','Send mess')
})

socket.on('sever--notification--mess-r',data=>{
    notifiChat.style.opacity=1;
    notifiChat.style.visibility='visible';
    
})
socket.on('sever--notification--end--mess-r',data=>{
    notifiChat.style.opacity=0;
    notifiChat.style.visibility='hidden';
})


getIdUser.forEach(el=>{
    el.addEventListener('click',()=>{
        const id=el.getAttribute('id');
        let load=`<div class="loadInfo">
        <div class="loadInfo__box">
          <span>Đang tải dữ liệu......</span>
        </div>
    </div>`
        boxInfo.innerHTML=load;
        fetch('/users/info/'+id).then(res=>res.json()).then(data=>{
            console.log(data)
            let inner=`<span class="information--id">${data._id}</span>
            ${data.img!=null ? `<img src="${data.img}" alt="">`:`<img src="https://i.pinimg.com/originals/40/95/30/4095301cfa355df50350f869d672f4d6.jpg" alt="">`}
            <span class="information--name">${data.nickname}</span>`

            boxInfo.innerHTML=inner;
        });
    })
})
imgFile.addEventListener('change',()=>{
    const file=document.getElementById('file').files;
    if(file.length>0){
        var reader=new FileReader(this);
        reader.onload=el=>{
            imgDemo.setAttribute('src',el.target.result);
        }
        reader.readAsDataURL(file[0]);
    }

})

socket.emit('signin',{
    id:idPublic.value,
    username:namePublic.innerHTML,
})

// b64
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
// Thêm nhóm
addRoom.addEventListener('click',function(e){

    var newRoom={
        nameRoom:nameRoom.value
    }
    // const formData=new FormData(this);
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
            doc.forEach(el=>{
                a.push(`<li><a href="/users/room/group/${el._id}">${el.name}</a></li>`)
            })
            listGroup.innerHTML=a.join(' ');
            // socket.emit('list--room',data)
            
        })
        nameRoom.value='';
    });

    
})
// Hiển thị nhóm
fetch('/users/room/'+idPublic.value).then(res=> res.json()).then(data=>{
    var a=[];
    // console.log(data);
    data.forEach(el=>{
        a.push(`<li><a href="/users/room/group/${el._id}">${el.name}</a></li>`)
    })
    listGroup.innerHTML=a.join(' ');
    // socket.emit('list--room',data)
    
})

boxChat.scrollTop=boxChat.scrollHeight;


sendMess.addEventListener('click',()=>{
    socket.emit('send--mess',{
        id:idPublic.value,
        username:namePublic.innerHTML,
        mess:messPublic.value,
        img:b64
    });
    // alert(mess.value);
    const s=document.createElement('div');
    s.classList.add('chat__me');
    let inner=`<span class="me--name info" id="${idPublic.value}">${namePublic.innerHTML}</span>
    <p class="me--mess">
    ${messPublic.value}
    </p>
    ${b64!=null?`<img src="${b64}" alt="" id="mess--img">`:''}
    `
    s.innerHTML=inner;
    boxMess.appendChild(s);
    messPublic.value='';
    // console.log(name.innerHTML)
    const boxChat=document.querySelector('.content--chat');
    boxChat.scrollTop=boxChat.scrollHeight;
    imgDemo.setAttribute('src','');
    imgFile.value=null;
    b64=null;

    const boxInfo=document.querySelector('.other--information');
    const getIdUser=document.querySelectorAll('.info');
    getIdUser.forEach(el=>{
    el.addEventListener('click',()=>{
        const id=el.getAttribute('id');
        let load=`<div class="loadInfo">
        <div class="loadInfo__box">
          <span>Đang tải dữ liệu......</span>
        </div>
    </div>`
        boxInfo.innerHTML=load;
        fetch('/users/info/'+id).then(res=>res.json()).then(data=>{
            console.log(data)
            let inner=`<span class="information--id">${data._id}</span>
            ${data.img!=null ? `<img src="${data.img}" alt="">`:`<img src="https://i.pinimg.com/originals/40/95/30/4095301cfa355df50350f869d672f4d6.jpg" alt="">`}
            <span class="information--name">${data.nickname}</span>`

            boxInfo.innerHTML=inner;
        });
    })
})

})

socket.on('sever--send',data=>{
    const s=document.createElement('div');
    s.classList.add('chat__friend');
    let inner=`<span class="friend--name info" id=${data.id}>${data.username}</span>
    <p class="friend--mess">
    ${data.mess}
    </p>
    ${data.img!=null?`<img src="${data.img}" alt="" id="mess--img">`:''}
    `
    s.innerHTML=inner;
    boxMess.appendChild(s);
    const boxChat=document.querySelector('.content--chat');
    boxChat.scrollTop=boxChat.scrollHeight;
    const boxInfo=document.querySelector('.other--information');
    const getIdUser=document.querySelectorAll('.info');
    getIdUser.forEach(el=>{
        el.addEventListener('click',()=>{
            const id=el.getAttribute('id');
            let load=`<div class="loadInfo">
            <div class="loadInfo__box">
              <span>Đang tải dữ liệu......</span>
            </div>
        </div>`
            boxInfo.innerHTML=load;
            fetch('/users/info/'+id).then(res=>res.json()).then(info=>{
                console.log(info)
                let inner=`<span class="information--id">${info._id}</span>
                ${info.img!=null ? `<img src="${info.img}" alt="">`:`<img src="https://i.pinimg.com/originals/40/95/30/4095301cfa355df50350f869d672f4d6.jpg" alt="">`}
                <span class="information--name">${info.nickname}</span>`
    
                boxInfo.innerHTML=inner;
            })
        })
    })
})
