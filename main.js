chatInputBox = document.getElementById("input_line");
chat_list = document.getElementById("chat_list");
chat_zone = document.getElementById("chat_zone");

latest_chat_record = null;

const magic_8_ball_lines = ["It is certain", "Reply hazy, try again", "Don’t count on it", "It is decidedly so", "Ask again later",
"My reply is no", "Without a doubt", "Better not tell you now", "My sources say no", "Yes definitely", "Cannot predict now", "Outlook not so good",
"You may rely on it", "Concentrate and ask again", "Very doubtful", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes"];

chat_history = [];

chatInputBox.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        // Consume current content of the chat field
        let insertedText = chatInputBox.value;
        console.log(insertedText)
        // Clear input
        chatInputBox.value = "";
        // Insert a new chat bubble
        addChat("guest", insertedText, "NOW");
        random_magic_8_ball_reply();
    }
});

function addChat(actor, text, time)
{
    if (time == "NOW") 
    {
        time = new Date()
        time = `${time.getHours()}:${time.getMinutes()}`;
    }
    let new_list_item = document.createElement("li");
    new_list_item.innerText = text;
    new_list_item.className = "chat " + actor;
    chat_list.appendChild(new_list_item);
    if (latest_chat_record != null && 
        latest_chat_record["time"] == time) 
    { // Cosy the new chat and the previous chat together
        if (latest_chat_record["actor"] == actor) {
            latest_chat_record.element.className += " cosy";
        }
    }
    else
    {
        let time_span = document.createElement("span");
        time_span.className = "time";
        time_span.innerText = time;
        new_list_item.prepend(time_span);
    }
    // Add to the chat history array
    latest_chat_record = {"actor": actor, "time": time, "text": text, "element": new_list_item}
    chat_history.push(latest_chat_record);
    // Scroll the chat window down
    chat_zone.scrollTop = chat_zone.scrollHeight;
}

function introduction()
{
    chatInputBox.focus();
    addChat("host", "Welcome to Chat Replay!", "NOW");
    setTimeout(() => addChat("host", "I am wise Lily. I know all", "NOW"), 1000);
    setTimeout(() => addChat("host", "Fortunes... futures...", "NOW"), 3000);
    setTimeout(() => addChat("host", "And everything in-between!", "NOW"), 5000);
    setTimeout(() => addChat("host", "Ask me any yes or no question", "NOW"), 7000);
    // host_lines.forEach((v, index) =>  { setTimeout(() => addChat("host", v, "00:00"), 4000 * index+1 )});
}

function random_magic_8_ball_reply()
{
    let response_index= Math.floor(Math.random() * magic_8_ball_lines.length);
    let random_response = magic_8_ball_lines[response_index];
    setTimeout(() => addChat("host", random_response, "NOW"), 1000 )   
}

introduction();