var db={
				'0':{id:0,name:'微云'},
				'1':{id:1,pId:0,name:'文件夹1'},
				'2':{id:2,pId:1,name:'电影'},
				'3':{id:3,pId:1,name:'电视剧'},
				'4':{id:4,pId:1,name:'音乐'},
				'5':{id:5,pId:0,name:'文件夹2'},
				'6':{id:6,pId:5,name:'压缩包'},
				'7':{id:7,pId:0,name:'文件夹3'},
			};
			

const  obj={
contents:document.querySelector('.dhy_tbb'),
content:document.querySelector('.dhy_tbb ul'),
children:document.querySelector('.dhy_tbb ul').children,
reName:document.querySelector('.li4'),
delet:document.querySelector('.li5'),
creatFole:document.querySelector('.li6'),
remove:document.querySelector('.li3'),
crumbs:document.querySelector('.dhy_topw ul'),
currentListId: 0,
checkBuff:{length:0},//缓存选中的文件
checkboxAll:document.querySelector('.checkbox-all'),
cnum:document.querySelector('.cnum'),
choose:document.querySelector('.choose'),
shade:document.querySelector('.shade'),
fnBtns:document.querySelector(".dhy_dn ul"),
none:document.querySelector(".dhy_tbb .none"),
moveTargetId: 0,
refresh:document.querySelector('.li7'),
sort:document.querySelector('.sort'),
timeSort:document.querySelector('.dhy_p1'),
SoreBut:document.querySelector('.dhy_fcc'),
 menu:document.querySelector('.menus'),
 

}

var flag=false;
var flags=false;
var tt=false;

var clickRname=false;//当重命名的时候 clickRname为true
int(obj.currentListId);
//初始化
function int(currentListId){

	initCheckedFiles();
	createList(db, obj.currentListId);//再页面上生成文件
	obj.checkBuff={length:0};
	crumbsList(db, obj.currentListId);//获取父级 生成面包屑
	showEmptyInfo();
	obj.choose.style.opacity="0";
	flag=false;
}

//刷新
obj.refresh.addEventListener('click',function(e){
	e.cancelBubble = true;
	disapper();
	int(obj.currentListId);
	fnBtnUse(false);
})

   // 生成当前层级下的子文件
function createList(db,id){
	obj.content.innerHTML="";
	 var children = getChildrenById(db, id);//获取子集文件
children.forEach(function(item, i) {
	//循环子集 将生成的结构 加载到obj.content里面
    obj.content.appendChild(createFolderHtml(item)) 
  });

}


// 生成所有子集面包屑
function crumbsList(db, id){
	obj.crumbs.innerHTML="";	
	var data =getAllParents(db, id);//找到当前和他的父级
	data.forEach(function(item,i){
		obj.crumbs.appendChild(crumbsCon(item));
	});
	
}


//事件委托 当点击每一个文件夹 
obj.content.addEventListener('click',function(e){
	e.stopPropagation();
	var target=e.target;
	disapper();
	
	if(target.classList.contains('file') ||target.classList.contains('file-img') ){		
		//生成所有的子集页面
		
		int(obj.currentListId = target.listId);	
	}
	if(target.classList.contains('checkbox')){	
		
		checkTick(target.parentNode);
	}
})


obj.crumbs.addEventListener('click', function (e){
	e.stopPropagation();
	disapper();
	const target = e.target;
	
	//如果 该元素的id不存在 或者不是父级的id  该元素作为子集生成面包屑
	if(target.hrefId !== undefined && obj.currentListId !== target.hrefId){
		int(obj.currentListId = target.hrefId);
		
	}

  });

//单选
function checkTick(lis){
	const {children,checkBuff,cnum,checkboxAll}=obj;
	// const lis = target.parentNode;
	const {listId} = lis;	// listId =lis.listId
	var isCheck=lis.classList.toggle('active');	
   if(isCheck){
   	checkBuff[listId] = lis;
   	checkBuff.length++;  
   }else{   		
   	delete checkBuff[listId]; 
   	checkBuff.length--;
   }
const checkedLen =cnum.innerHTML=checkBuff.length;

if(checkedLen===children.length){
	checkboxAll.classList.add('active'); 
}else{
	checkboxAll.classList.remove('active'); 
}

}
//全选
obj.checkboxAll.addEventListener('click', function(e){	
	e.stopPropagation();
	disapper();
	var checke=this.classList.toggle('active');//为真的话 全选中
	toggleCheckAll(checke);

});
function toggleCheckAll(isChecked){
  const {content, checkBuff, cnum, children} = obj;
  
  const len = children.length;
  
  if(isChecked){
    checkBuff.length = cnum.innerHTML = len;
  }else{
    obj.checkBuff = {length: 0};
    cnum.innerHTML = 0;
	}
	for(let i=0; i<len; i++){
    const child = children[i];
    const {listId} = child;
    child.classList.toggle('active', isChecked);
    if(!checkBuff[listId] && isChecked){
      checkBuff[listId] = child;
    }
  }
}
//重命名

obj.reName.addEventListener('click',function(e){
	e.stopPropagation();
	
	disapper();
	fnBtnUse(true);
const{checkBuff}=obj;
const len=checkBuff.length;

if(len>1){
	fnBtnUse(false);
	return alertMessage('只能选中一个文件', 'show');
	
}
if(!len){
	fnBtnUse(false);
	return alertMessage('请选择文件', 'show');	
	
}
setName(checkBuff,true);

});

function alertMessage(text,cls){
  obj.choose.innerHTML=text;
  obj.choose.classList.add(cls);
}

function setName(checkBuff,showMessage, succFn, failFn){
	
	const checkedEles = getcheckBuff(checkBuff)[0];
	const {listId, fileNode} = checkedEles;

	const nameText = fileNode.querySelector('.file-name p');
	const nameInput = fileNode.querySelector('.rename');

	dblSetCls(nameInput, nameText, 'show');	
	const oldName = nameInput.value = nameText.innerHTML;
	nameInput.focus();
    flag=true;
  
//flags=false;
	nameInput.onblur = function (e){
		 e.stopPropagation();		
		e.cancelBubble = true;
		let newName = this.value.trim();
		if(!newName){
			
			dblSetCls(nameText, nameInput, 'show');
			
			this.onblur = null;
			tt=false;
			failFn&&failFn();
			fnBtnUse(false);
			 
			 flag=false;
			 
			return showMessage&&alertMessage('取消重命名', 'show');
			

		  }
		  if(newName === oldName){
			dblSetCls(nameText, nameInput, 'show');
			this.onblur = null;
			tt=false;
			failFn&&failFn();
			fnBtnUse(false);
		 
		 flag=false;
			return;
		  }

		  if(!nameCanUse(db, obj.currentListId, newName)){//名字一样的时候
			this.select();
			fnBtnUse(false);
			flag=false;
			return showMessage&&alertMessage('命名冲突', 'show');
			
		  }
		  nameText.innerHTML = newName;
		  dblSetCls(nameText, nameInput, 'show');
		  setItemById(db, listId, {name: newName});
		  
		  showMessage&&alertMessage('命名成功', 'show','sucess');
		  this.onblur = null;
			succFn&&succFn(newName);
			 fnBtnUse(false);
			 flag=false;
	};

	window.onkeyup = function (e){
		if(e.keyCode === 13){
		  nameInput.blur();
		  this.onkeyup = null;
		}
	  };

}


//显示加上class
function dblSetCls(show, hidden, cls){
	show.classList.add(cls);
	hidden.classList.remove(cls);
  }


//将选中的元素缓存转成数组
function getcheckBuff(checkBuff){
let data=[];
for(let key in checkBuff){
	if(key !=='length'){
		const currentItem = checkBuff[key];//key是id
		data.push({//将选中的元素变为一个数组  [(id,元素)]
			listId:key,
			fileNode: currentItem
		});
	}
}
return data;
}


// 信息提示功能
function alertMessage(text, type, cls){
	clearTimeout(alertMessage.timer);
	const {choose} = obj;
	
	choose.innerHTML ='<span></span>'+ text;
	if(typeof cls=="undefined"){cls=type}
	choose.classList.add(type);
	choose.classList.add(cls);
	
	animation({
		el: choose,
		attrs: {
			top: 90,
			opacity:  1,
		},
		duration:300,
	  cb(){
		alertMessage.timer = setTimeout(function() {
			choose.innerHTML = '';
			animation({
				el: choose,
				attrs: {
					opacity:  0,
				 display:'none',
				top:0
				},
			});
			choose.classList.remove(type);
			choose.classList.remove(cls);
		}, 800);
	  }
	});
  }

//删除功能
obj.delet.addEventListener('click',function(e){
	e.stopPropagation();
	disapper();
	const {checkBuff,choose,shade}=obj;
	const len =checkBuff.length;
	if(!len){
		return alertMessage('请选中文件', 'show');
	}
	shade.classList.add('show');
 	shade.appendChild(sureDele('是否确定要删除'));
	const cancel=document.getElementById("btn").children[1];
	const sure=document.getElementById("btn").children[0];
	cancel.addEventListener('click',function(){
		hideDialog();
		 alertMessage('取消删除文件', 'show');
	});
	delePoin=document.querySelector('.dele-poin'),
	delePoin.addEventListener('click',function(e){
		hideDialog();
		 alertMessage('取消删除文件', 'show');
	});

	sure.addEventListener('click', function (e){
		e.stopPropagation();
		deletFiles();
		hideDialog();
	  });
	
	
})

function deletFiles(){
	const {checkBuff}=obj;
	
	var delefileData=getcheckBuff(checkBuff);
	delefileData.forEach(function(item){
		const{listId,fileNode}=item;
	obj.content.removeChild(fileNode);	
	checkBuff.length--;
	// if(!checkBuff.length){
	// 	obj.checkBuff={length:0};	
	// }else{
	// 	delete checkBuff[listId];
	// }
	delete checkBuff[listId];
	deleteItemById(db, listId);

	});
	obj.checkboxAll.classList.remove('active');
	toggleCheckAll(false);
	
	alertMessage('删除成功', 'show','sucess');
	showEmptyInfo();
	
}

function hideDialog(){
			obj.shade.classList.remove('show');
			obj.shade.innerHTML = '';
		  }


//禁止/启用功能键
function fnBtnUse(abled){
	const {fnBtns}=obj;
	const btns=fnBtns.children;
	if(abled){//为假 不执行点击事件 	
	for(let i=0;i<btns.length-1; i++){		
		btns[i].classList.add('disabled');			
		}
	}else{
		for(let i=0;i<btns.length-1; i++){		
			btns[i].classList.remove('disabled');
				
			}
	}

}

//新建文件夹

function initCheckedFiles(){
	if(obj.checkBuff.length > 0){//如果 缓存器中有元素
	  obj.checkboxAll.classList.remove('active');//全选按钮取消选中
		obj.checkBuff = {length: 0};
		obj.cnum.innerHTML = 0;//  缓存器清空
	for(let i=0; i<obj.children.length; i++){
		obj.children[i].classList.remove('active');
		
	}	
	}
  }

obj.creatFole.addEventListener('click',function(e){
	e.stopPropagation();
disapper();

	fnBtnUse(true);
	initCheckedFiles();
	const {currentListId, content, checkBuff} = obj;

	const newFolderData = {
		id: Date.now(),
		name: '',
		pId: obj.currentListId
	  };
	   
	 // 将新的数据加载到页面
	  const newFolderNode = createFolderHtml(newFolderData);
	  content.insertBefore(newFolderNode,content.firstElementChild);
	  checkTick(newFolderNode);
	  showEmptyInfo();


	  setName(
		checkBuff,
		false,
		(name) => {
		  newFolderData.name = name;
		  addOneData(db, newFolderData);
		  showEmptyInfo();
		  
			alertMessage('新建操作成功','show','sucess');

			localStorage.setItem('id', JSON.stringify(db));
		},
		() => {
			content.removeChild(newFolderNode);
		  
			showEmptyInfo();
//			 if(int(obj.currentListId)){
//			 return	alertMessage('刷新成功', 'show','sucess');
//			 }
initCheckedFiles();
		  alertMessage('取消新建操作', 'show');
		}
	  );

});

// 是否显示目录为空的提示
function showEmptyInfo(){
	obj.none.classList.toggle('show', !obj.content.children.length);
	obj.contents.classList.toggle('show', !obj.content.children.length);
	}
	
	//移动文件
	obj.remove.addEventListener('click',function(e){
		e.stopPropagation();
		disapper();
		const {checkBuff} = obj;
		const len = checkBuff.length;
    if(!len){
			return alertMessage('尚未选中文件', 'show');
		}

		setfile(sureFn, cancelFn);//移动文件函数
		
		function cancelFn(){
			alertMessage('取消移动文件', 'show')
		}
    
	});
	function sureFn(){
		const {content, checkBuff} = obj;
		//将选中的元素转化为数组
    const checkedEles =getcheckBuff(checkBuff);
    
		let canMove = true;
		
		for(let i=0, len=checkedEles.length; i<len; i++){
      const {listId, fileNode} = checkedEles[i];
      const ret = canMoveData(db,listId, obj.moveTargetId);
      if(ret === 2){
        return alertMessage('已经在当前目录', 'show');
      
      }
      if(ret === 3){
        return alertMessage('不能移动到子集', 'show');
        
      }
      if(ret === 4){
        return alertMessage('存在同名文件', 'show');
      
      }
    }

		if(canMove){
      checkedEles.forEach(function(item, i) {
        const {listId, fileNode} = item;
        moveDataToTarget(db, listId, obj.moveTargetId);
        content.removeChild(fileNode);
      });
      initCheckedFiles();
      showEmptyInfo();
    }


	}


	function setfile(sureFn, cancelFn){
		const {shade, currentListId} = obj;
		
		const treeListNode = creatMenu(createTreeList(db, 0, currentListId));
		
		shade.appendChild(treeListNode);
		
		shade.classList.add('show');
		
		const filemenu = document.querySelector('.menu');
		
		treeListNode.style.left = (shade.clientWidth - treeListNode.offsetWidth) / 2 + 'px'; 
		treeListNode.style.top = (shade.clientHeight - treeListNode.offsetHeight) / 2 + 'px'; 
		
		dragEle({
			downEle: filemenu.querySelector('h3'),
			moveEle: filemenu
		});
		
		const listTreeItems = document.querySelectorAll('.fils h2');
		
		let prevActive = currentListId;
		
		for(let i=0, len=listTreeItems.length; i<len; i++){
			listTreeItems[i].onclick = function (e){
				e.cancelBubble = true;
				listTreeItems[prevActive].classList.remove('active');
				this.classList.add('active');
				prevActive = i;
				obj.moveTargetId = this.dataset.fileId * 1;
			
			};
			
			listTreeItems[i].firstElementChild.onclick = function (e){
				e.cancelBubble = true;
				const allSiblings = [...this.parentNode.parentNode.children].slice(1);
				
				if(allSiblings.length){
					allSiblings.forEach(function(item, i) {
						item.style.display = item.style.display === '' ? 'none' : '';
					});
				}
				var open=this.classList.toggle('open');
				  this.nextElementSibling.classList.toggle('open',open);
			
			}
		}
		
		const sureBtn = filemenu.querySelector('.btn').children[0];
		const cancelBtn = filemenu.querySelector('.btn').children[1];
		const closeBtn = filemenu.querySelector('h3 span');
		
		sureBtn.onclick = function (e){
			e.stopPropagation();
			sureFn&&sureFn();
			closeTreeList();
		};
		cancelBtn.onclick = closeBtn.onclick = function (e){
			e.stopPropagation();
			cancelFn&&cancelFn();
			closeTreeList();
		};
		closeBtn.onmousedown = function (e){
			e.stopPropagation();
		};
		
		function closeTreeList(){
			filemenu.classList.remove('show');
			shade.classList.remove('show');
			shade.innerHTML = '';

		}
	}


function clearCls(){
	for(let i=0;i<obj.SoreBut.length;i++){
		obj.SoreBut[i].classList.remove('hover');
		
		}
}


//右键

    
    document.body.addEventListener('contextmenu', function (e){
    	flag=true;
    	
    	
      e.preventDefault();
       e.stopPropagation();
      var x = e.pageX, y = e.pageY;
      
      // 必须先显出来然后才能获取到尺寸
       obj.menu.style.display = 'flex';
      if(window.innerWidth - x < obj.menu.offsetWidth){
        x = window.innerWidth - obj.menu.offsetWidth;
      }
      
      if(window.innerHeight - y < obj.menu.offsetHeight){
        y = window.innerHeight - obj.menu.offsetHeight;
      }
      
      obj.menu.style.left = x + 'px';
      obj.menu.style.top = y + 'px';
       obj.menu.style.opacity = '1';
      obj.menu.style.transform = 'scale(1)';     
        obj.menu.children[0].addEventListener('click',function(e){
			e.stopPropagation();			
				int(obj.currentListId);
				disapper();	

});
   obj.menu.children[1].onclick=function(e){
			 e.preventDefault();
			 e.stopPropagation();
			  disapper();
			  
		initCheckedFiles();	 
	  fnBtnUse(true);
	 
	const {currentListId, content, checkBuff} = obj;

	const newFolderData = {
		id: Date.now(),
		name: '',
		pId: obj.currentListId
	  };
	 // 将新的数据加载到页面
	  const newFolderNode = createFolderHtml(newFolderData);
	  content.insertBefore(newFolderNode,content.firstElementChild);
	  checkTick(newFolderNode);
	  showEmptyInfo();
	  setName(
		checkBuff,
		false,
		(name) => {
		  newFolderData.name = name;
		  addOneData(db, newFolderData);
		  showEmptyInfo();
			alertMessage('新建操作成功','show','sucess');
   disapper();
   
//			localStorage.setItem('id', JSON.stringify(db));
		},
		() => {
			if(tt){return;}
			content.removeChild(newFolderNode);
		  initCheckedFiles();//所有都清空
			showEmptyInfo();//是否显示目录为空		
      
		  alertMessage('取消新建操作', 'show');
		  disapper();
		}
	  );};
	 	

      
     obj.menu.children[2].onclick=function(e){
			e.stopPropagation();
				int(obj.currentListId);
				disapper();	
};  
       obj.menu.children[3].onclick=function(e){
			e.stopPropagation();
				int(obj.currentListId);
				disapper();	
};  
       obj.menu.children[4].onclick=function(e){
			e.stopPropagation();
				int(obj.currentListId);
				disapper();	
};  
      
    });
    
 
    function disapper(){
      	flag=false;
	      flags=false;
    	  obj.menu.style.display = '';
          obj.menu.style.opacity = 0;
     
      obj.menu.style.transform = 'scale(0)';
    }
 document.body.addEventListener('click', function (e){
   	e.stopPropagation()  	
   	  var l=obj.menu.offsetLeft;
      var lr=obj.menu.offsetLeft+obj.menu.offsetWidth;
      var t=obj.menu.offsetTop;
      var b=obj.menu.offsetTop+obj.menu.offsetHeight;
   	  var x1=e.pageX, y1=e.pageY;
   	if(x1>l&&x1<lr&&y1>t&&y1<b){flags=true;}
   	else{flags=false;}
 	if(flags){return;}	
       obj.menu.style.display = '';
         obj.menu.style.opacity = 0;
     flag=false;
      obj.menu.style.transform = 'scale(0)';
    });




