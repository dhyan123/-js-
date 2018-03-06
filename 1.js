

  document.body.onmousedown = function (e){ 
  	
	if(flag){return;
	}
//	
//obj.checkBuff={length:0};
//  obj.cnum.innerHTML='0';
    e.preventDefault();
    target =e.target;
if(target.classList.contains('file') ||target.classList.contains('file-img')||target.classList.contains('checkbox')||target.classList.contains('checkbox-all')){
    	return;
    }
  if(target.classList.contains('li3') ||target.classList.contains('li4')||target.classList.contains('li5')||target.classList.contains('li6')||target.classList.contains('li7')){return;} 
    
    
  
	var div = document.createElement('div');
 div.className = 'kuang';
 document.body.appendChild(div);
 var startX = e.pageX;
 var startY = e.pageY;
 document.body.onmousemove = function (e){

  
    var x = e.pageX, y = e.pageY;
    
    var l = Math.min(x, startX);
    var t = Math.min(y, startY);
    var w = Math.abs(x - startX);
    var h = Math.abs(y - startY);
    
   var num=0;
    for(let i=0; i<obj.children.length; i++){
      item =obj.children[i];
     const {children,checkBuff,cnum,checkboxAll}=obj;   
     const {listId} = item;
       if(duang(div, item)){
              item.classList.add('active');
              if(obj.children[i].classList.contains('active'))
              { num++; obj.checkBuff.length=num;  } 
              checkBuff[listId] = item;
              const checkedLen =cnum.innerHTML=checkBuff.length;
              if(checkedLen===children.length){
               checkboxAll.classList.add('active'); 
             }else{
               checkboxAll.classList.remove('active'); 
             }
            }
            else{
             item.classList.remove('active');
             delete checkBuff[listId]; 
               cnum.innerHTML='0';
              obj.checkBuff={length:0};
             checkboxAll.classList.remove('active'); 
            }
    }   
    div.style.left = l + 'px';
    div.style.top = t + 'px';
    div.style.width = w + 'px';
    div.style.height = h + 'px';  
 }
 document.body.onmouseup = function (e){

  document.body.removeChild(div);
   this.onmouseup = this.onmousemove = null;
 };
}


