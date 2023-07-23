const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clear Messages')
		.addStringOption(option => option.setName('count').setDescription('Count (if not given only delete 1)').setRequired(false)),
	async execute(interaction) {
		if (!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.reply({ content: "Du hast keine Berechtigung diesen Command zu verwenden!", ephemeral: true });

		let count = interaction.options.getString('count');

        if (!count) count = 1;

        await interaction.channel.bulkDelete(count);

		if (count == 1) return await interaction.reply({ content: `Delted ${count} Message!`, ephemeral: true });
        
		return await interaction.reply({ content: `Delted ${count} Messages!`, ephemeral: true });
	},
};