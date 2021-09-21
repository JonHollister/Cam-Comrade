/*Assets is an object containing component objects, each of which holds both strings referencing the images and alpha channel masks to be used by the botfather Vision API and Match class. These strings are given as relative file paths with the main Cam Comrade installation dir being referenced as the relative origin point. Meanwhile, numerical data sets the maximum percent of pixels which must be detected identically to each asset object in order for a Match to be declared. Finally, the limit number serves to limit the number of Matches sought by the Vision API*/

const assets =
    update: {
        asset: "assets/ud.png",
        score: 0.95,
        mask: "assets/ud_mask.png",
        limit: 1
    },
    ok: {
        asset: "assets/ok.png",
        score: 0.75,
        mask: "assets/ok_mask.ping",
        limit: 1
    },
    news: {
        asset: "assets/news.png",
        score: 0.95,
        mask: "assets/news_mask.png"
        limit: 1
    },
    start: {
        asset: "assets/start.png",
        score: 0.9,
        mask: "assets/start_mask.png",
        limit: 1
    },
    startEx: {
        asset: "assets/start_x.png",
        score: 0.95,
        mask: "assets/start_x_mask.png",
        limit: 1
    },
    events: {
        assets: "assets/events.png",
        score: 0.95;
        mask: "assets/events_mask.ping",
        limit: 1
    },
    ex: {
        assets: "assets/x.png",
        score: 0.80;
        mask: "assets/x_mask.png",
        limit: 1
    },
    chatBox: {
        asset: "assets/chat.png",
        score: 0.85,
        mask: "assets/chat_mask.png",
        limit: 1
    },
    chatExpand: {
        asset: "assets/chat_expand.png",
        score: 0.95,
        mask: "assets/chat_expand_mask.png",
        limit: 1
    },
    charGrey: {
        asset: "assets/char_grey.png",
        score: 0.90,
        mask: "assets/char_grey_mask.png"
        limit: 1
    },
    charGlowing: {
        asset: "assets/char_glow.png",
        score: 0.85,
        mask: "assets/char_glow_mask.png",
        limit: 1
    },
    red: {
        asset: "assets/red.png",
        score: 0.85,
        mask: "assets/red_mask.png",
        limit: 20
    }
}

/*The following four objects hold identifying keys plus the relevant values for all of the fields in the Botfather config window, retrieving them using the Botfather Config.getValue() method*/

const tw = {
    usn: Config.getValue("tw_usn"), 
    pass: Config.getValue("tw_pass"), 
    post: Config.getValue("tw_post")
};
const chat = {
    chan: Config.getValue("chat_chan"), 
    pass: Config.getValue("chat_pass")
};
const scrn = {
    x: Config.getValue("screen_x"), 
    y: Config.getValue("screen_y"), 
    rectColor: Config.getValue("rect_clr"), 
    rectPix: Config.getValue("rect_px"),
    take_pics: Config.getValue("take_pics")
};
const adv = {
    dbg: Config.getValue("debug_do"), 
    tick: Config.getValue("tick"), 
    pak: Config.getValue("package"), 
    take_names: Config.getValue("take_names")
};

/*The variable echoesState defines what work phase Cam Camera must currently work within. As an example, consider the "unit" phase: during the initiation phase  bot searches for the start 'button' text, followed by the news pop-up, followed by the update pop-up - ordered by the frequency with which each state is encountered by the bot. This is intended such that should the start button be present - the intended endpoint and desired screenstate for initiation interactions - the bot skips over any of the code relating to the other two possible, less common screenstates. If the potential screenstates were in another order, the update and news IF blocks would be evaluated for truth first despite being detected much less frequently than the start screenstate.*/

var echoes_state = "init";

/*The Interaction class handles the final step of the (detect phase)->(define targets)->(scan for targets)->(act upon flagged targets) bot loop. Provided with a single Botfather library Point object plus an integer between 50 and 250, the instance is constructed accordingly and upon calling the .exec() method a single Tap is fired off to the ADB (Android Debug Bridge) system following a pause equal to the integer value in milliseconds. Should the object however be constructed with a Point, the pause integer, a second Point, and a second integer value between 300 and 700, the .exec() method instead produces a Swipe from the first to the second Point with a duration equal to the second integer in milliseconds, following a pause similar to that which precedes the Tap version of the .exec() method. The purpose of the pause is to 'humanize' the interactions by randomizing the pauses between Taps / Swipes within reasonable bounds, as a lack of minute pauses between touch events would be potentially characteristic of a bot*/
class Interaction {
    
    constructor(tapPoint, pauseIn, swipePoint = null, swipeDur) {
        this.p1 = tapPoint;
        this.p2 = swipePoint;
        this.pause = (Math.random() * 200) + 50;
        this.dur = (Math.random() * 300) + 3507~zz so;
     }
     
     exec() {
         Helper.msleep(this.pause);
         if (this.p2) {
             Android.swndSwipe(this.p1, this.p2, this.dur);
         } else {
             Android.sendTap(this.p1);
         }
     }
}

class Asset {
    
    constructor(obj_in, color_in = "red", pix_in = 2) {
        this.needle = new Image(obj_in.asset);
        this.mask = new Image(obj_in.mask);
        this.score = obj_in.score;
        this.limit = obj_in.limit;
        this.haystack;
        this.color = new Color(color_in);
        this.px = pix_in;
        this.matches;
        this.loca;
        this.flagged;
        this.scanned;
    }
    
    scan() {
        
        switch (typeof this.matches) {
            
            case null:
                Helper.log("No match found");
                this.flagged = null;
                return this.matches;
                
            case 'undefined':
                this.matches = Vision.findMaskedMatches(this.haystack, this.needle, this.mask, this.score, this.limit);
                if (this.matches.isValid()) {
                    Helper.log("Match newly located!");
                } else {
                    Helper.log("No match found") 
                    this.matches = null;
                }
                return this.matches;
                
            default:
                Helper.log("Preexisting match exists");
                return this.matches;
                
        }
    }
    
    flag() {
        
        if (!this.matches.isValid()){
            Helper.log("No matches exist to be flagged");
            return null;
        } else {
            
            switch (typeof this.flagged) {
                
                case null:
                    Helper.log("Match sought previously, unsuccessfully");
                    return null;
                    
                case 'undefined':
                    this.flagged = Vision.markMatches(this.haystack, this.matches, this.color, this.px);
                    if (this.flagged) {
                        let date_time = new Date().toISOString();
                        loca = path(date_time, "mugshots");
                        this.flagged.saveImage(loca);
                        Helper.log(`Matches flagged and saved as ${loca}`);
                    } else {
                    this.flagged = null;
                        Helper.log("Nothing to flag");
                    }
                    return this.flagged;
                    
                default:
                    Helper.log(`Matches previously flagged as ${loca}`);
                    return this.flagged;
                    
            }
        }
        
    }
    
}



if (Android.connected()) {
    
    Helper.log("Emulator connected!");
    Helper.sleep(2);
    Helper.log("Searching for game package...");
    Helper.sleep(1);
    if (Android.startApp(adv.pak)) {
        Helper.log("Game package found! Initializing surveillance system...");
        main();
    } else {
        Helper.log("Opening game package...");
        Android.startApp(adv.pak);
    }
} else {
    Helper.log("Waiting for emulator connection...");
}

function main() {
    while (state == "active") {
        
        Helper.msleep(adv.tick);
    }
}

/*The path() function takes one or two args, corresponding to a file name and the folder within which it should be located. Using a template literal marked with backticks, variable names can be substituted into the string value to be returned. if only a single argument is passed in, the folder defaults to assets/, the location where all the target images are located.*/
function path(fileName, inFolder = "assets") {
    return `${inFolder}/${fileName}.png`;
}

function prereqSetup(state_in) {
    switch (state_in) {
        case "init":
            break;
        case "inGame":
            let startTgt = new Asset(assets.start, scrn.rectClr, scrn.rectPix);
            if (startTgt) {
                reaction("start", startTgt);
                break;
            } 
            let newsTgt = new Asset(assets.news, s
            
    }
}

function reaction(targetType, matches) {
    switch (targetType) {
        case "init":
            let update = new Asset(assets.update, rect_clr, rect_px);
            update.scan();
            update.flag();
    }
}

function getPoint(matches) {
    
}

function  aim(matches) { //takes array of Matches
    //let hits = []; //creates empty scope-limited array
    for (var targ of matches_in) { //iterate thru array
        let box = targ.getRect(); //derive Rect
        let spot = box.randomPoint(); //call for random Point inside Rect
        //hits.push(spot}; //push Point into hits array
        tap(spot);
    }
    //return hits;// return array of hits 
}
  
function setInteract(spotsIn, sleepCoef) {
    for (let spot of spotsIn) {
        
    }
    let pre = Math.random() * 0.25;//random between 0 and .25
    Helper.msleep(pre);//sleep for duration
    Android.sendTap(spot); //tap spot. Spot is a random point in the Match's screen Rect with random delay before tapping to 'humanize' the outputs
}
