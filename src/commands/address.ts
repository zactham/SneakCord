// Imports
import { Command } from "discord-akairo";
import Discord, { Message } from "discord.js";

class AddressCommand extends Command {
  constructor() {
    super("address", {
      aliases: ["address"],
      channel: "dm",
      args: [
        {
          id: "address",
          type: "string",
          match: "content",
        },
      ],
    });
  }

  exec(message: Message, args: any) {
    if (args.address) {
      // Creating embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setDescription(getAddresses(args.address));

      // Sending embed to requester channel
      return message.channel.send(embed);
    } else {
      // Creating embed
      const embed = new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give address");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }
  }
}

module.exports = AddressCommand;
export {};

const getAddresses = (address: string) => {
  console.log(`Address: ${address}`);

  let result = "";

  for (let i = 0; i < 10; i++) {
    result += `${genPrefix()} ${address}\n`;
  }

  return result;
};

const genPrefix = () => {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};
