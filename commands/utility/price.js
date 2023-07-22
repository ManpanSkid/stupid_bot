const { SlashCommandBuilder } = require('discord.js');
const priceEmbedList = require('../../priceEmbed.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('price')
    .setDescription('Show current Price List'),
  async execute(interaction) {

    return await interaction.reply({ embeds: priceEmbedList.embeds, ephemeral: false });
  },
};
