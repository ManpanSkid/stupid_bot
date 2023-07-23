const { SlashCommandBuilder } = require('discord.js');
const { embeds } = require('../../orderEmbedClient.json')

const setTitleForm = (title) => {
	title = "Bestellung - " + title;

	return title;
};

const setDateForm = () => {
	const dateData = new Date

	let day = dateData.getDate();
	let month = dateData.getMonth();

	if (day < 10) day = '0' + day;
	if (month < 10) month = '0' + month;

	const date = `Datum: \n	**${day}.${month}.${dateData.getFullYear()}** \n\n`; 

	return date;
};

const setPriceForm = (price) => {
	price = `Preis: \n**${price}€** \n\n`; 

	return price;
};

const setMethodForm = (method) => {
	method = `Zahlungsmethode: \n**${method}** \n\n`; 

	return method;
};

const setDescriptionForm = (description) => {
	description = `Aufgegebene Bestellung: \n**${description}**`;
	description = description.replace('+', '\n');

	return description;
};

const setUserForm = (user) => {
	user = `Auftraggeber: \n**${user.toString()}** \n\n`; 

	return user;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('order')
		.setDescription('Bestellung Aufgeben')
		.addStringOption(option => option.setName('title').setDescription('Bestellungs Tietel').setRequired(true))
		.addStringOption(option => option.setName('description').setDescription('Bestellungs Info (Mit + neuen Stichpunkt)').setRequired(true))
		.addStringOption(option => option.setName('price').setDescription('Preis der Bestellung').setRequired(true))
		.addStringOption(option => option.setName('method').setDescription('Zahlungsmethode (bspw. Paypal, Paysafe)').setRequired(true))
		.addUserOption(option => option.setName('user').setDescription('Auftraggeber').setRequired(true)),
	async execute(interaction) {
		if (!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.reply({ content: "Du hast keine Berechtigung diesen Command zu verwenden!", ephemeral: true });

		const title = setTitleForm(interaction.options.getString('title'));
		const date = setDateForm();
		const price = setPriceForm(interaction.options.getString('price'));
		const method = setMethodForm(interaction.options.getString('method'));
		const description = setDescriptionForm(interaction.options.getString('description'));
		const user = setUserForm(interaction.options.getUser('user'));

		embeds[0].description = date + price + method + user + description;
		embeds[0].title = title;

        //interaction.channel.send({ embeds: embeds });
        
		return await interaction.reply({ embeds: embeds, ephemeral: false });
	},
};