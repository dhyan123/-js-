
// 根据id获取指定的数据
function getItemById(db, id){
  return db[id];
}

// 根据id获取当前层级的所有文件
function getChildrenById(db, id){
  const data = [];
  for(let key in db){
    const item = db[key];
    if(item.pId === id){
      data.push(item);
    }
  }
  
  return data;
}

// 根据指定的id找到当前这个文件以及它的所有的父级
function getAllParents(db, id){
  let data = [];
  const current = db[id];
  
  if(current){
    data.push(current);
    data = getAllParents(db, current.pId).concat(data);
  }
  
  return data;
}

// 根据指定id删除对应的数据以及它所有的子集
function deleteItemById(db, id){
  if(!id) return false;  // 根目录不能删除
  delete db[id];
  let children = getChildrenById(db, id);
  let len = children.length;
  if(len){
    for(let i=0; i<len; i++){
      deleteItemById(db, children[i].id);
    }
  }
  return true;
}




//生成当前的文件夹
     function createFolderHtml(data){
     var lis = document.createElement('li');
     lis.className ='file';
        lis.innerHTML =`<div class="checkbox "></div>
          <div class="file-img"></div>
          <div class="file-name" >
          <p title="${data.name}" class="show">${data.name}</p>
          <input class="rename" type="text"    />
          </div>
          
          `;
       
      //给每一个添加自定义属性
      lis.listId = data.id;
      var listDiv=lis.querySelectorAll('div');
      
      for( var i=0; i<listDiv.length; i++){
      	listDiv[i].listId = data.id;
      	
      }
      
      return lis;
    }
 
 
//生成面包屑
function crumbsCon(data){	
  var lis=document.createElement('li');
  lis.innerHTML=`<a href="">${data.name}</a><span>></span>`;
  //给里面的a标签添加自定义属性
  var href = lis.querySelector('a');
  href.hrefId = data.id;
  href.href = 'javascript:;';
	return lis;
}

// 判断名字是否可用
function nameCanUse(db, id, text){
  const currentData = getChildrenById(db, id);
  console.log(id);
  return currentData.every(item => item.name !== text);
  //把item作为形参传入函数中
}

// 根据id设置指定的数据
function setItemById(db, id, data){   // setItemById(db, 0, {name: '123'})
const item = db[id];//当前的数据
// for(let key in data){
//   item[key] = data[key];//新的name值等于找到的item这条数据的name值
// }
return item&&Object.assign(item, data);  // 合拼对象里面的属性
}

//生成是否确定删除
function sureDele(text){
	var deles=document.createElement('div');
	deles.className='dele';
	deles.innerHTML=`<div class="dele-poin"></div>
             <div style="clear:both;"></div>
           <div class="dele-p">
            <span></span>
       				${text}
    					</div>
			<div class="btn" id="btn">
			<span class="active">确定</span>
			<span>取消</span>
			</div>`;
			console.log(deles);
    return deles;
}

// 添加一条数据
function addOneData(db, data){
  return db[data.id] = data;
}

//生成菜单
function createTreeList(db, id = 0, currentListId){
  const data = db[id];
  const floorIndex = getAllParents(db, id).length;//获取父级的个数
  const children = getChildrenById(db, id);//获取子集文件
  const len = children.length;
  
  let str = `<ul>`;
  
  str += `<li>
            <h2 data-file-id="${data.id}" class="${currentListId === data.id ? 'active' : ''}" style="padding-left: ${(floorIndex-1)*15}px;">
            <em data-file-id="${data.id}" class=""></em>
            <span data-file-id="${data.id}"></span>
            <i data-file-id="${data.id}" >${data.name}</i>
             
            </h2>`;
  
  if(len){
    for(let i=0; i<len; i++){
      str += createTreeList(db, children[i].id, currentListId);
    }
  }
  
  return str += `</li></ul>`;
}



function creatMenu(treeListHtml){
  var menu=document.createElement('div');
  menu.className="menu";
  menu.innerHTML=`<h3><span></span>选中存储位置</h3>
  <h4>JS基础课程</h4>
  <div class="fils">
  ${treeListHtml}
  </div>
  <div class="btn"><span class="active">确定</span><span>取消</span></div> `;

  return menu;
}


// 判断可否移动数据
function canMoveData(db, currentId, targetId){
  const currentData = db[currentId];
  console.log(currentData);
  
  const targetParents = getAllParents(db, targetId);
  
  if(currentData.pId === targetId){
    return 2; // 移动到自己所在的目录
  }
  
  if(targetParents.indexOf(currentData) !== -1){
    return 3;   // 移动到自己的子集
  }
  if(!nameCanUse(db, targetId, currentData.name)){
    return 4; // 名字冲突
  }
  
  return 1;
}

function moveDataToTarget(db, currentId, targetId){
  db[currentId].pId = targetId;
}