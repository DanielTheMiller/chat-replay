chatInputBox = document.getElementById("input_line");
chat_list = document.getElementById("chat_list");
chat_zone = document.getElementById("chat_zone");
start_btn = document.getElementById("start_btn");
stop_btn = document.getElementById("stop_btn");
send_btn = document.getElementById("send_btn");
status_span = document.getElementById("time_status_icon");
time_display_div = document.getElementById("time_display");
time_text_p = document.getElementById("time_text");

app_state = "INIT";
mode = "N/A"; // Options are RECORD|PLAYBACK

const magic_8_ball_lines = ["It is certain", "Reply hazy, try again", "Don't count on it", "It is decidedly so", "Ask again later",
"My reply is no", "Without a doubt", "Better not tell you now", "My sources say no", "Yes definitely", "Cannot predict now", "Outlook not so good",
"You may rely on it", "Concentrate and ask again", "Very doubtful", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes"];

global_chat_history = [];
recording_chat_history = [];
recording_started_time = null;
recording_paused_time = null;
upcoming_playback_chats = [];

function send_chat() {
    // Consume current content of the chat field
    let insertedText = chatInputBox.value;
    if (insertedText === undefined || insertedText === "") 
    {
        // Won't accept a blank string chat
        return;
    }
    // Clear input
    chatInputBox.value = "";
    // Insert a new chat bubble
    addChat("guest", insertedText, "NOW");
    handleGuestChat(insertedText);
}

function handleGuestChat(chatText) {
    switch (app_state) {
        case ("INIT"):
            return;
        case ("MENU"):
        {
            switch (chatText) {
                case "1":
                    intro_record_chat_sequence()
                    return;
                case "2":
                    intro_replay_chat_sequence()
                    return;
                case "3":
                    magic8BallLaunch()
                    return;
                default:
                    setTimeout(() => addChat("host", "I'll be real with you, hooman, I don't know what you're after", "NOW"), 100);
                    return;
            }
        }
        case ("READY_TO_RECORD"):
        case ("RECORD"):
            record_chat(chatText);
            return;
        case ("STOPPED"):
            export_history(chatText);
            return;
        case ("MAGIC"):
            random_magic_8_ball_reply();
            return;
        case ("REPLAY?"):
            if (chatText.toLowerCase() == "yes")
            {
                upcoming_playback_chats = recording_chat_history;
                intro_replay_chat_sequence(true);
                return;
            }
            introduction(true);
    }
}

function addChat(actor, text, time)
{
    if (time == "NOW") 
    {
        time = new Date()
        time = `${new String(time.getHours()).padStart(2, '0')}:${new String(time.getMinutes()).padStart(2, '0')}`;
    }
    let new_list_item = document.createElement("li");
    new_list_item.innerText = text;
    new_list_item.className = "chat " + actor;
    chat_list.appendChild(new_list_item);
    latest_chat_record = global_chat_history[global_chat_history.length-1];
    if (latest_chat_record != null && latest_chat_record["time"] == time) 
    { // Cosy the new chat and the previous chat together
        if (latest_chat_record["actor"] == actor) {
            latest_chat_record.element.className += " cosy";
        }
    }
    else
    {
        new_list_item.className += " timestamped";
        new_list_item.setAttribute('data-timestamp', time);
    }
    // Add to the chat history array
    latest_chat_record = {"actor": actor, "time": time, "text": text, "element": new_list_item}
    global_chat_history.push(latest_chat_record);
    // Scroll the chat window down
    chat_zone.scrollTop = chat_zone.scrollHeight;
    // Pop sound
    var sound;
    if (actor == "host") 
    {
        sound = document.getElementById("pop_sound"); 
    }
    else
    {
        sound = document.getElementById("ding_sound"); 
    }
    sound.play(); 
}

function introduction(backToMenu=false)
{
    chatInputBox.focus();
    todayContext = "today";
    if (!backToMenu) {
        addChat("host", "Welcome to Chat Replay!", "NOW");
        todayContext = "now";
    }
    setTimeout(() => addChat("host", "What would you like to do "+todayContext+"?", "NOW"), 1000);
    setTimeout(() => addChat("host", "1.) Record a chat sequence", "NOW"), 2000);
    setTimeout(() => addChat("host", "2.) Replay a chat sequence", "NOW"), 3000);
    setTimeout(() => addChat("host", "3.) Play magic 8 ball with me", "NOW"), 4000);
    setTimeout(() => {
        addChat("host", "Tell me a number to pick your choice", "NOW");
        app_state = "MENU";
    }, 5000);
}

function magic8BallLaunch()
{
    app_state = "INIT";
    setTimeout(() => addChat("host", "I am wise Lily. I know all", "NOW"), 1000);
    setTimeout(() => addChat("host", "Fortunes... futures...", "NOW"), 3000);
    setTimeout(() => addChat("host", "And everything in-between!", "NOW"), 5000);
    setTimeout(() => {addChat("host", "Ask me any yes or no question", "NOW"); app_state = "MAGIC";}, 7000);
}

function random_magic_8_ball_reply()
{
    let response_index= Math.floor(Math.random() * magic_8_ball_lines.length);
    let random_response = magic_8_ball_lines[response_index];
    setTimeout(() => addChat("host", random_response, "NOW"), 1000 )   
}

function intro_record_chat_sequence()
{
    mode = "RECORD";
    app_state = "INIT";
    reset_timer();
    start_btn.className = start_btn.className.replace("pause", "run");
    setTimeout(() => {addChat("host", "Okay! Lets record a chat sequence!", "NOW"); show_timer();}, 500);
    setTimeout(() => {addChat("host", "The recording will start when you make your first chat...", "NOW"); app_state = "READY_TO_RECORD"}, 1500);
}

function intro_replay_chat_sequence(instant_replay)
{
    mode = "PLAYBACK";
    app_state = "INIT";
    reset_timer();
    start_btn.className = start_btn.className.replace("pause", "run");
    if (instant_replay == false) {
        setTimeout(() => {addChat("host", "Okay! You need to upload a chat log file!", "NOW"); show_timer();}, 500);
    }
    setTimeout(() => {addChat("host", "Great! the replay is loaded and ready for you to start", "NOW"); show_timer();}, 500);
    setTimeout(() => {addChat("host", "The playback will start when you click play...", "NOW"); app_state = "READY_TO_REPLAY"}, 1500);   
}

function end_of_replay()
{
    app_state = "INIT";
    reset_timer();
    hide_timer();
    setTimeout(() => addChat("host", "--- END OF CHAT REPLAY REACHED ---", "NOW"), 500);
    introduction(true);
}

function record_chat(chat_text) {
    if (app_state == "READY_TO_RECORD") 
    {
        start_timer();
    }
    // Add chat to recorded list
    if (app_state == "RECORD") 
    {
        current_time = new Date().getTime();
        time = current_time - recording_started_time;
        latest_chat_record = {"time": time, "text": chat_text};
        recording_chat_history.push(latest_chat_record);
    }
}

function show_timer()
{
    if (time_display_div.className == null) {
        time_display_div.className = "shown";
        return;
    }
    if (time_display_div.className.includes("shown")) {
        warn("Attempt was made to show time display that was already shown");
        return;
    }
    time_display_div.className = time_display_div.className + " shown";
}

function start_timer()
{
    switch (app_state) 
    {
        case ("READY_TO_RECORD"):
        case ("READY_TO_REPLAY"):
        {
            if (mode == "RECORD") {
                setTimeout(() => addChat("host", "(You're now recording!)", "NOW"), 100);
                setTimeout(() => addChat("host", "(Click on the time display above to pause your timer)", "NOW"), 1100);       
                app_state = "RECORD";
            } 
            else 
            {
                app_state = "REPLAY";
            }
            // Set time started to now
            recording_started_time = new Date().getTime();
            start_btn.className = start_btn.className.replace("run", "pause")
            break;
        }
        case ("PAUSED"):
        case ("STOPPED"):
        {
            if (mode == "RECORD") {
                app_state = "RECORD";
            } else {
                app_state = "REPLAY";
            }
            resume_timer();
            start_btn.className = start_btn.className.replace("run", "pause")
            break;
        }
        case ("RECORD"):
        case ("REPLAY"):
        {
            pause_timer();
            start_btn.className = start_btn.className.replace("pause", "run")
            return;
        }
    }
    status_span = document.getElementById("time_status_icon");
    status_span.className = "running";
}

function pause_timer()
{
    app_state = "PAUSED"
    status_span.className = "paused";
    recording_paused_time = new Date().getTime();
}

function resume_timer()
{
    // On resume, take the time at which the timer was paused and work out the duration between then and now
    // Add the duration to the recording_started_time
    durationOfPause = new Date().getTime() - recording_paused_time;
    recording_started_time += durationOfPause;
}

function stop_timer()
{
    status_span.className = "stopped";
    app_state = "STOPPED"
    start_btn.className = start_btn.className.replace("pause", "run")
    recording_paused_time = new Date().getTime();
    setTimeout(() => addChat("host", "The recording has been stopped!", "NOW"), 250);
    setTimeout(() => addChat("host", "Chat a filename to export the playback (i.e. 'CommentaryFile')", "NOW"), 500);
    setTimeout(() => addChat("host", "Alternatively, click record to resume your recording", "NOW"), 750);
}

function hide_timer()
{
    if (!time_display_div.className.includes("shown")) {
        warn("Attempt was made to hide time display that was not shown");
        return;
    }
    if (time_display_div.className == "shown") {
        time_display_div.className = null;
    }
    time_display_div.className = time_display_div.className.replace(" shown", "");
}

function reset_timer()
{
    status_span.className = "stopped";
    app_state = "STOPPED"
    start_btn.className = start_btn.className.replace("pause", "run")
    time_text_p.innerText = "00:00:00";
    recording_paused_time = null;
    if (mode == "RECORD") {
        time_display_div.className = time_display_div.className.replace("playback", "record");
    } else {
        time_display_div.className = time_display_div.className.replace("record", "playback");
    }
}

function export_history(filename)
{
    hide_timer();
    // Validate filename
    filename = filename.replace(".", "");
    filename += ".json";
    // Ensure no extensions get through
    // Serialize content
    file_content = JSON.stringify(recording_chat_history);
    // Export file
    let blobdtMIME =
        new Blob([file_content], { type: "application/json" })
    let url = URL.createObjectURL(blobdtMIME);
    let anele = document.createElement("a");
    anele.setAttribute("download", filename);
    anele.href = url;
    anele.click();
    setTimeout(() => addChat("host", "Exported successfully!", "NOW"), 50);
    setTimeout(() => addChat("host", "Would you like to replay the sequence you just recorded? (Yes/No)", "NOW"), 500);
    app_state = "REPLAY?";
}

start_btn.addEventListener("click", () => start_timer());
stop_btn.addEventListener("click", () => stop_timer());
send_btn.addEventListener("click", () => send_chat());

chatInputBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        send_chat();
    }
});

function update_time_display_value(current_time)
{
    time_text_p.innerText = new String(current_time.getHours()-1).padStart(2, '0') + ":" +
                            new String(current_time.getMinutes()).padStart(2, '0') + ":" +
                            new String(current_time.getSeconds()).padStart(2, '0');
}

function display_recorded_chats(current_time)
{
    nextChat = upcoming_playback_chats[0];
    while (nextChat != null && nextChat.time <= current_time) {
        newTime = new String(current_time.getHours()-1).padStart(2, '0') + ":" 
                + new String(current_time.getMinutes()).padStart(2, '0');
        addChat("host", nextChat["text"], newTime);
        // Remove the chat from upcoming playback chats
        upcoming_playback_chats.shift();
        nextChat = upcoming_playback_chats[0];
    }
    if (nextChat == null) {
        end_of_replay();
    }
}

function main_loop()
{
    console.log("Current app state: "+app_state+"; Recording started time: "+recording_started_time);
    if (app_state != "RECORD" && app_state != "REPLAY") {
        return;
    }
    var current_time = new Date();
    current_time.setTime(current_time.getTime() - recording_started_time);
    update_time_display_value(current_time);
    if (app_state == "REPLAY") {
        display_recorded_chats(current_time);
    }
}
            
setInterval(() => main_loop(), 100); // Start ticking
introduction();