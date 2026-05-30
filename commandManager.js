const commandExecutor = async (bot, username, message) => {
    // let stext = message.toString().split(" ")
    // if (stext[0] === "!bot") {
    //     console.log(stext[1])
    // } else {
    //     movement.move(bot,username);
    // }
    for(const step in message.plan){
        console.log(message.plan[step].step)
        const capability = require(`./capabilities/${message.plan[step].capability}/${message.plan[step].capability}.js`);
        switch (message.plan[step].action) {
            case "moveTo":
                console.log("moveTo");
                await capability.moveTo(bot, message.plan[step].params);
                break;
            case "followPlayer":
                 console.log("followPlayer")
                // await capability.followPlayer(bot, username);
                break;
            case "mine_block":
            case "mineBlockType":
                console.log("mineBlockType");
                await capability.mineBlockType(bot, message.plan[step].params);
                break;
            default:{
                console.log(`unknown action: ${message.plan[step].action}`);
                break;
            }
        }
    }
}



module.exports = { commandExecutor };





const message = {
  "task": {
    "id": "task_001",    
    "goal": "Mine 5 iron ores",
    "priority": "high",
    "status": "in_progress"
  },

  "context": {
    "environment": "overworld",    
    "nearby_entities": [],
    "inventory_summary": ["wooden_pickaxe", "bread"],
    "health": 20
  },

  "required_capabilities": [
    "movement",    
    "mining",
    "inventory"
  ],

  "plan": [
    {
      "step": 1,    
      "action": "followPlayer",
      "capability": "movement",
      "params": "eyeweb",
      "expected_output": "following"
    },
    {
      "step": 2,    
      "action": "moveTo",
      "capability": "movement",
      "params": {
        "x": "$location_of_iron.x",    
        "y": "$location_of_iron.y",
        "z": "$location_of_iron.z"
    }
    },
    {
        "step": 3,    
      "action": "mine_block",
      "capability": "mining",
      "repeat": 5,
      "params": {
        "block_type": "iron_ore"    
    }
    }
  ],
  
  "tools": [
    {
      "name": "pickaxe_check",    
      "purpose": "Ensure bot has pickaxe before mining"
    }
  ],
  
  "memory": {
      "store": ["location_of_iron"],    
    "update": true
  },

  "fallback": {
    "on_fail": [
        {
            "action": "craft_item",    
        "params": { "item_name": "stone_pickaxe", "quantity": 1 }
      }
    ]
},

  "completion": {
    "success_condition": "inventory contains 5 iron_ore",    
    "on_complete": [
      {
        "action": "talk_to_player",    
        "params": { "message": "Task completed!" }
      }
    ]
  }
}


if (require.main === module) {
    commandExecutor("ai", "myAi", message);
}