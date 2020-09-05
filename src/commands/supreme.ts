const Discord = require("discord.js");
const { Command } = require("discord-akairo");
const rp = require("request-promise");
const cheerio = require("cheerio");
const paginationEmbed = require("discord.js-pagination");

class SupremeCommand extends Command {
  constructor() {
    super("supreme", {
      aliases: ["supreme", "sup", "preme"],
      args: [
        {
          id: "command",
          type: "string",
        },
        {
          id: "argument",
          type: "string",
          match: "content",
        },
      ],
    });
  }

  async exec(message: any, args: any) {
    let command: string = "";
    let argument: string = "";

    // Verifying command
    if (args.command) {
      // Preparing command for checks
      command = args.command.toLowerCase();
    } else {
      // Create error embed
      const embed = await new Discord.MessageEmbed()
        .setColor("#5761C9")
        .setTitle("Please give supreme specific command");

      // Sending embed to requester channel
      return message.channel.send(embed);
    }

    // Verifying argument
    if (args.argument.split(" ")[1]) {
      // Checking command requirement and removing content
      if (command === "droplist") {
        argument = args.argument.toLowerCase().replace("droplist ", "");
      } else if (command === "sellout") {
        argument = args.argument.toLowerCase().replace("sellout ", "");
      } else if (command === "news") {
        argument = args.argument.toLowerCase().replace("news ", "");
      } else if (command === "left2drop") {
        argument = args.argument.toLowerCase().replace("left2drop ", "");
      } else if (command === "lookbook") {
        argument = args.argument.toLowerCase().replace("lookbook ", "");
      } else if (command === "preview") {
        argument = args.argument.toLowerCase().replace("preview ", "");
      }
    }

    // Identifying shopify-specific command
    if (command === "droplist") {
      // Run Supreme droplist scraper
      console.log("Running Supreme droplist scraper");

      let droplist, items: any;

      // Fetch all data
      try {
        // Fetching recent droplist
        droplist = await getDroplist();

        // Fetching droplist items
        items = await getItems(droplist);
      } catch (err) {
        console.log(err);
      }

      // Create and structure embed
      let embed = await createDroplistEmbed(items, droplist);

      // Sending embed to requester channel
      return paginationEmbed(message, embed);
    } else if (command === "sellout") {
      // Run Supreme sellout times scraper
      console.log("Running Supreme sellout times scraper");
    } else if (command === "news") {
      // Run Supreme news scraper
      console.log("Running Supreme news scraper");
    } else if (command === "left2drop") {
      // Run Supreme left2drop scraper
      console.log("Running Supreme left2drop scraper");
    } else if (command === "sellout") {
      // Run Supreme left2drop scraper
      console.log("Running Supreme left2drop scraper");
    } else if (command === "lookbook") {
      // Run Supreme lookbook scraper
      console.log("Running Supreme lookbook scraper");

      let items: any;

      // Fetch all data
      try {
        // Fetching recent droplist
        items = await getLookbook();
      } catch (err) {
        console.log(err);
      }

      // Create and structure embed
      let embed = await createLookbookEmbed(items);

      // Sending embed to requester channel
      return paginationEmbed(message, embed);
    } else if (command === "preview") {
      // Run Supreme sellout time scraper
      console.log("Running Supreme preview scraper");
    } else {
      console.log(argument);
    }
  }
}

module.exports = SupremeCommand;
export {};

const options = (url: string) => ({
  url,
  transform: (body: any) => {
    return cheerio.load(body);
  },
});

// Fetches recent droplist
const getDroplist = async () => {
  // Sending GET request to droplists page
  const $ = await rp(
    options("https://www.supremecommunity.com/season/latest/droplists/")
  );

  const path = $("a.block").first().attr("href");

  // Returning latest droplist URL
  return `https://www.supremecommunity.com/${path}`;
};

// Fetches droplist items
const getItems = async (droplist: string) => {
  let items: any = [];

  // Converting response to html
  const $ = await rp(options(droplist));

  // Get all of the items
  const dropItems = await $(".card.card-2");

  // Loop through each item
  dropItems.each((index: any, element: any) => {
    let data: any = {};

    // Item ID
    data.id = index + 1;

    // Adding dynamic data if availabe
    if ($(element).find("h2").text()) {
      data.name = $(element).find("h2").text();
    }
    if ($(element).find(".label-price").text()) {
      data.price = $(element).find(".label-price").text().trim();
    }
    if ($(element).find("img").attr("src")) {
      data.image = $(element).find("img").attr("src");
    }
    if ($(element).find("img").attr("alt")) {
      data.description = $(element).find("img").attr("alt").split(" - ")[1];
    }
    if ($(element).find(".category").text()) {
      data.category = $(element).find(".category").text();
    }
    if ($(element).find(".upvotes").text()) {
      data.upvotes = $(element).find(".upvotes").text();
    }
    if ($(element).find(".downvotes").text()) {
      data.downvotes = $(element).find(".downvotes").text();
    }

    // Push items into array
    items.push(data);
  });

  // Returning array of drop items
  return items;
};

// Fetches lookbook data
const getLookbook = async () => {
  let lookbookItems: any = [];

  // Converting response to html
  const $ = await rp(options("https://www.supremenewyork.com/lookbooks"));

  // Loop through loobook items
  $("#lookbook-items").each((_index: any, ul: any) => {
    const children = $(ul).children();
    children.each((_index: any, li: any) => {
      const children = $(li).children();
      children.each((_index: any, data: any) => {
        let item: any = {};

        // Scrape available data
        if ($(data).find("button").attr("data-idx")) {
          item.id = $(data).find("button").attr("data-idx");
        }
        if ($(data).find("img").attr("src")) {
          item.src = $(data).find("img").attr("src");
        }
        if ($(data).find("img").attr("alt")) {
          item.alt = $(data).find("img").attr("alt");
        }

        // Push items into array
        lookbookItems.push(item);
      });
    });
  });

  // Removed empty item from array
  lookbookItems.shift();

  // Returning array of lookbook items
  return lookbookItems;
};

// Structures droplist embed
const createDroplistEmbed = async (items: any, droplist: any) => {
  let pages: any = [];

  // Adding introduction page
  const embedIntro = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("Supreme Droplist")
    .setURL(droplist)
    .setDescription(
      "Browse through the embed pages to see all upcoming items from this week's drop! Community popularity rankings goes from greatest to least."
    );

  // Pushing introductory page
  pages.push(embedIntro);

  // Looping through each item
  items.forEach((item: any) => {
    // Create embed
    const embedPage = new Discord.MessageEmbed().setColor("#5761C9");

    // Checking and inputting dynamic data
    if (item.name) {
      embedPage.setTitle(item.name);
    }
    if (item.description) {
      embedPage.setDescription(item.description);
    }
    if (item.image) {
      embedPage.setImage(`https://www.supremecommunity.com${item.image}`);
    }
    if (item.price) {
      embedPage.addField("Price", item.price, true);
    }
    if (item.category) {
      embedPage.addField(
        "Category",
        `${item.category.charAt(0).toUpperCase()}${item.category.slice(1)}`,
        true
      );
    }
    if (item.upvotes) {
      embedPage.addField("Upvotes", item.upvotes, true);
    }
    if (item.downvotes) {
      embedPage.addField("Downvotes", item.downvotes, true);
    }

    // Pushing embed page
    pages.push(embedPage);
  });

  // Return structured embed pages
  return pages;
};

// Structures lookbook embed
const createLookbookEmbed = async (items: any) => {
  let pages: any = [];

  // Adding introduction page
  const embedIntro = new Discord.MessageEmbed()
    .setColor("#5761C9")
    .setTitle("Supreme Lookbook FW20")
    .setURL("https://www.supremenewyork.com/lookbooks")
    .setDescription(
      "Browse through the embed pages to see shots of upcoming items in this Supreme season!"
    );

  // Pushing introductory page
  pages.push(embedIntro);

  // Looping through each item
  items.forEach((item: any) => {
    // Create embed
    const embedPage = new Discord.MessageEmbed().setColor("#5761C9");

    // Checking and inputting dynamic data
    if (item.id) {
      embedPage.setTitle(`Lookbook Item ${parseInt(item.id) + 1}`);
    }
    if (item.alt) {
      embedPage.addField("Item Highlights", item.alt, true);
    }
    if (item.src) {
      embedPage.setImage(`https:${item.src}`);
    }

    // Pushing embed page
    pages.push(embedPage);
  });

  // Return structured embed pages
  return pages;
};
