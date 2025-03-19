const fs = require("fs")

module.exports = async (client) => {

  const SlashsArray = []

  fs.readdir(`./src`, (error, folder) => {
    folder.forEach(subfolder => {
      fs.readdir(`./src/commands/`, (error, files) => {
        files.forEach(files => {

          if (!files?.endsWith('.js')) return;
          files = require(`../src/commands/${files}`);
          if (!files?.name) return;
          client.slashCommands.set(files?.name, files);

          SlashsArray.push(files)
        });
      });
    });
  });
};
