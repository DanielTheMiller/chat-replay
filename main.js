chatInputBox = document.getElementById("input_line");
chat_list = document.getElementById("chat_list");
chat_zone = document.getElementById("chat_zone");
start_btn = document.getElementById("start_btn");
stop_btn = document.getElementById("stop_btn");
send_btn = document.getElementById("send_btn");

app_state = "INIT";

const magic_8_ball_lines = ["It is certain", "Reply hazy, try again", "Don't count on it", "It is decidedly so", "Ask again later",
"My reply is no", "Without a doubt", "Better not tell you now", "My sources say no", "Yes definitely", "Cannot predict now", "Outlook not so good",
"You may rely on it", "Concentrate and ask again", "Very doubtful", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes"];

global_chat_history = [];
recording_chat_history = [];
recording_started_time = null;
recording_paused_time = null;

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
    if (app_state == "INIT") {
        return;
    }
    if (app_state == "MENU") {
        switch (chatText) {
            case "1":
                intro_record_chat_sequence()
                return;
            case "2":
                addChat("host", "This is coming soon", "NOW");
                return;
            case "3":
                magic8BallLaunch()
                return;
            default:
                setTimeout(() => addChat("host", "I'll be real with you, hooman, I don't know what you're after", "NOW"), 100);
                return;
        }
    }
    if (app_state == "READY_TO_RECORD" || app_state == "RECORD") {
        record_chat(chatText)
        return;
    }
    if (app_state == "MAGIC") {
        random_magic_8_ball_reply();
        return;
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

function introduction()
{
    chatInputBox.focus();
    addChat("host", "Welcome to Chat Replay!", "NOW");
    setTimeout(() => addChat("host", "What would you like to do today?", "NOW"), 1000);
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
    app_state = "INIT";
    setTimeout(() => {addChat("host", "Okay! Lets record a chat sequence!", "NOW"); show_timer();}, 500);
    setTimeout(() => {addChat("host", "The recording will start when you make your first chat...", "NOW"); app_state = "READY_TO_RECORD"}, 1500);
}

function record_chat(chat_text) {
    if (app_state == "READY_TO_RECORD") 
    {
        start_timer();
    }
    // Add chat to list
    current_time = new Date().getTime();
    time = current_time - recording_started_time;
    latest_chat_record = {"time": time, "text": chat_text};
    recording_chat_history.push(latest_chat_record);
}

function show_timer()
{
    time_display_div = document.getElementById("time_display");
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
        {
            setTimeout(() => addChat("host", "(You're now recording!)", "NOW"), 100);
            setTimeout(() => addChat("host", "(Click on the time display above to pause your timer)", "NOW"), 1100);                    
            // This is the first time timer has started
            setInterval(() => update_time_display_value(), 1000); // Start ticking for the first time
            // Set time started to now
            recording_started_time = new Date().getTime();
            app_state = "RECORD";
            start_btn.className = start_btn.className.replace("record", "pause")
            break;
        }
        case ("PAUSED"):
        {
            app_state = "RECORD";
            resume_timer();
            start_btn.className = start_btn.className.replace("record", "pause")
            break;
        }
        case ("RECORD"):
        {
            pause_timer();
            start_btn.className = start_btn.className.replace("pause", "record")
            return;
        }
    }
    status_span = document.getElementById("time_status_icon");
    status_span.className = "recording";
}

function pause_timer()
{
    app_state = "PAUSED"
    status_span = document.getElementById("time_status_icon");
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
    status_span = document.getElementById("time_status_icon");
    status_span.className = "stopped";
    app_state = "STOPPED"
    start_btn.className = start_btn.className.replace("pause", "record")
}

function hide_timer()
{
    time_display_div = document.getElementById("time_display");
    if (!time_display_div.className.includes("shown")) {
        warn("Attempt was made to hide time display that was not shown");
        return;
    }
    if (time_display_div.className == "shown") {
        time_display_div.className = null;
    }
    time_display_div.className = time_display_div.className.replace(" shown", "");
}

function update_time_display_value()
{
    if (app_state === "PAUSED") {
        return;
    }
    time_text_p = document.getElementById("time_text");
    var current_time = new Date();
    current_time.setTime(current_time.getTime() - recording_started_time);
    time_text_p.innerText = new String(current_time.getHours()-1).padStart(2, '0') + ":" +
                            new String(current_time.getMinutes()).padStart(2, '0') + ":" +
                            new String(current_time.getSeconds()).padStart(2, '0');
}

start_btn.addEventListener("click", () => start_timer());
stop_btn.addEventListener("click", () => stop_timer());
send_btn.addEventListener("click", () => send_chat());

chatInputBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        send_chat();
    }
});

introduction();