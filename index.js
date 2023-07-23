const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType, Partials } = require('discord.js');

const welcomeEmbed = require('./welcomeEmbed.json');

require('dotenv').config();

const client = new Client({ 
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// #region Command Collection
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
// #endregion

client.once(Events.ClientReady, c => {
	console.log(`Started! \nName: ${c.user.tag} | Version: ${require('discord.js').version}`);

	client.user.setActivity('Mistico Graphics', { type: ActivityType.Watching });
});

client.on('guildMemberAdd', member => {
	const serverName = member.guild.name;
	let embed = welcomeEmbed.embeds;

	embed.description = `Wilkommen, ${member.displayName} auf ${serverName}!`

	member.guild.channels.get(process.env.WELCOMECHANNEL).send({ embeds: embed });
});

client.on('messageReactionAdd', async (reaction, user, channel) => {
	if (user.bot) return;
	
	reaction.users.remove(user);

	if (reaction.message.id !== process.env.VERIFYMESSAGE) return;
	if (reaction.emoji.name !== process.env.VERIFYREACTION) return;

	try {
		const role = reaction.message.guild.roles.cache.get(process.env.VERIFYROLE);

		if (!role) {
			console.log('Invalid role ID:', process.env.VERIFYROLE);
			return;
		}

		const member = reaction.message.guild.members.cache.get(user.id);

		await member.roles.add(role);
		console.log(`Added role "${role.name}" to user ${user.tag}`);
	} catch (error) {
		console.error('Error occurred:', error);
	}
});

/*
lient.on('messageReactionRemove', async (reaction, user, channel) => {
	if (reaction.message.id !== process.env.VERIFYMESSAGE) return;
	if (user.bot) return;

	if (reaction.emoji.name !== process.env.VERIFYREACTION) return;

	try {
		const role = reaction.message.guild.roles.cache.get(process.env.VERIFYROLE);

		if (!role) {
			console.log('Invalid role ID:', process.env.VERIFYROLE);
			return;
		}

		const member = reaction.message.guild.members.cache.get(user.id);

		await member.roles.remove(role);
		console.log(`Remove role "${role.name}" from user ${user.tag}`);
	} catch (error) {
		console.error('Error occurred:', error);
	}
});
*/

// #region Interaction
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
// #endregion

client.login(process.env.TOKEN);