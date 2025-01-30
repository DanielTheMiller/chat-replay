chatInputBox = document.getElementById("input_line");
chat_list = document.getElementById("chat_list");
chat_zone = document.getElementById("chat_zone");

latest_chat_record = null;
app_state = "INIT";

const magic_8_ball_lines = ["It is certain", "Reply hazy, try again", "Don't count on it", "It is decidedly so", "Ask again later",
"My reply is no", "Without a doubt", "Better not tell you now", "My sources say no", "Yes definitely", "Cannot predict now", "Outlook not so good",
"You may rely on it", "Concentrate and ask again", "Very doubtful", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes"];

chat_history = [];

chatInputBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        // Consume current content of the chat field
        let insertedText = chatInputBox.value;
        // Clear input
        chatInputBox.value = "";
        // Insert a new chat bubble
        addChat("guest", insertedText, "NOW");
        handleGuestChat(insertedText);
    }
});

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
    if (app_state == "READY_TO_RECORD") {

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
    chat_history.push(latest_chat_record);
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
    // host_lines.forEach((v, index) =>  { setTimeout(() => addChat("host", v, "00:00"), 4000 * index+1 )});
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

introduction();