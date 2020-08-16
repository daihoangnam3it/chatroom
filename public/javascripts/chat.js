var socket=io();

const id=document.getElementById('userid');
const name=document.getElementById('nameHello');
const other=document.getElementById('idOther');
const send=document.getElementById('send');
const sendImg=document.getElementById('send--img');
const mess=document.getElementById('mess');
var box=document.querySelector('.box--chat');
const img=document.getElementById('img');
const sendimg=document.getElementById('file');
sendimg.addEventListener('change',function(){
    const file=document.getElementById('file').files;
    if(file.length>0){
        var reader=new FileReader();

        reader.onload=function(event){
            img.setAttribute("src",event.target.result);
        }
        reader.readAsDataURL(file[0]);
    }

})

// console.log(img.value);
// img.crossOrigin='Anonymous';
var b64;
img.onload=function(){
    var canvas=document.createElement('canvas');
    var ctx=canvas.getContext('2d');
    canvas.height=this.naturalHeight;
    canvas.width=this.naturalWidth;
    ctx.drawImage(this,0,0);
    b64=canvas.toDataURL('image/jpeg');
    // console.log(data);
    
}


socket.emit('signin',{
    id:id.value,
        username:name.value,
})

// socket.emit('create--mess',{
//     idone:id.value,
//     idtwo:other.value
// })

send.addEventListener('click',()=>{
    socket.emit('priva--mess',{
      idtwo:other.value,
        idone:id.value,
        mess:mess.value,
        img:b64,
        createAt:Date.now()
    })
    socket.emit('send--mess-pri',{mess:mess.value,img:b64})
    const s=document.createElement('div');
    s.classList.add('mess-s');
    let inner=`<span id="mess--s"> ${mess.value}</span>
    <img src="${b64}" alt="" id="img" style="max-width:50px;max-height:50px;">
    `;
    s.innerHTML=inner;
    box.appendChild(s);
    mess.value='';
})
socket.on('sever--send--mess--prive',data=>{
    const s=document.createElement('div');
      s.classList.add('mess-s');
      let inner=`<span id="mess--g">${data.mess}</span>
      <img src="${data.img}" alt="" id="img" style="max-width:50px;max-height:50px;">
      `;
      s.innerHTML=inner;
      box.appendChild(s);

  })
// const img=document.getElementById('imge');

