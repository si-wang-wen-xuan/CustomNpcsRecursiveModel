//引入类
var EntityPig = Java.type("net.minecraft.entity.passive.EntityPig");
var NPCRendererHelper = Java.type("net.minecraft.client.renderer.entity.NPCRendererHelper");
var RenderManager = Java.type("net.minecraft.client.renderer.entity.RenderManager");
var NBTTagCompound = Java.type("net.minecraft.nbt.NBTTagCompound");
var EntityCustomNpc = Java.type("noppes.npcs.entity.EntityCustomNpc");
var EntityList = Java.type("net.minecraft.entity.EntityList");
var EntityLiving = Java.type("net.minecraft.entity.EntityLiving");
var EntityBat = Java.type("net.minecraft.entity.passive.EntityBat");
var EntityThrowable = Java.type("net.minecraft.entity.projectile.EntityThrowable");
//获取实体注册表里的Map
var stringToClassMapping = EntityList.field_75625_b;
//调用方法
nextNPCModel();
//给NPC切换到下一个模型
function nextNPCModel(){
	//new一个新的NBT
	var compound = new NBTTagCompound();
	//把当前NPC的NBT复制到新nbt里面
	npc.getMCEntity().func_70109_d(compound);
	//new一个新的NPC
	var newNpc = new EntityCustomNpc(npc.getMCEntity().field_70170_p);
	//把新的NPCNBT设置为旧NPC的NBT
	newNpc.func_70020_e(compound);
	//获取新的NPC当前模型
	var modelData = newNpc.modelData;
	//获取当前模型的下一个模型
	var nextModel = getNextEntity(modelData.getEntityClass());
	//设置新的NPC模型
	modelData.setEntityClass(nextModel.cl);
	//获取当前NPC的贴图
	var entity = modelData.getEntity(newNpc);
	//获取当前实体渲染器
	var render = RenderManager.field_78727_a.func_78713_a(entity);
	//设置新的NPC贴图
	var isTextrue = setNPCTexture(render,entity,newNpc,npc);
	var array = nextModel.array;
	//递归，因为有些贴图渲染错误，就直接跳过，设置下一个模型
	while(!isTextrue){
		array++;
		nextModel = getNextEntityArray(modelData.getEntityClass(),array);
		modelData.setEntityClass(nextModel.cl);
		var entity = modelData.getEntity(newNpc);
		var render = RenderManager.field_78727_a.func_78713_a(entity);
		isTextrue = setNPCTexture(render,entity,newNpc,npc);
	}
}

//设置NPC贴图
function setNPCTexture(render,entity,newNpc,npc){
	try{
		newNpc.display.texture = NPCRendererHelper.getTexture(render,entity);
		//新NPC的贴图设置重置
		newNpc.display.glowTexture = "";
		newNpc.textureLocation = null;
		newNpc.textureGlowLocation = null;
		//更新NPC
		newNpc.updateHitbox();
		//生成新的NPC
		npc.getMCEntity().field_70170_p.func_72838_d(newNpc);
		//删除旧的NPC
		//这样是为了重置当前NPC，否则NPC贴图和模型需要退出再进才会加载
		npc.despawn();
		return true;
	}catch(e){
		return false;
	}
}

//带有序列的获取
function getNextEntityArray(cl,array){
	var arr = stringToClassMapping.keySet().toArray();
	if(array >= arr.length - 1) array = 0;
	for(var i = array; i < arr.length; i++){
		var cl1 = stringToClassMapping.get(arr[i]);
		if(cl1 == cl){
			if(i >= arr.length - 1){
				return {
					cl:stringToClassMapping.get(arr[0]),
					array:i
				};
			}
			while(!EntityLiving.class.isAssignableFrom(stringToClassMapping.get(arr[i + 1]))){
				if(i >= arr.length - 1) i = 0;
				i++;
			}
			return {
				cl:stringToClassMapping.get(arr[i + 1]),
				array:i
			};
		}
	}
	return {
		cl:EntityBat.class,
		array:0
	};
}

//获取当前实体在MC注册器里的下一位
function getNextEntity(cl){
	var arr = stringToClassMapping.keySet().toArray();
	for(var i = 0; i < arr.length; i++){
		var cl1 = stringToClassMapping.get(arr[i]);
		if(cl1 == cl){
			if(i >= arr.length - 1){
				return {
					cl:stringToClassMapping.get(arr[0]),
					array:i
				};
			}
			while(!EntityLiving.class.isAssignableFrom(stringToClassMapping.get(arr[i + 1]))){
				if(i >= arr.length - 1) i = 0;
				i++;
			}
			return {
				cl:stringToClassMapping.get(arr[i + 1]),
				array:i
			};
		}
	}
	return {
		cl:EntityBat.class,
		array:0
	};
}