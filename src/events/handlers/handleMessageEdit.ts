import { Message, EmbedBuilder, PartialMessage } from "discord.js";

import { Camperbot } from "../../interfaces/Camperbot";
import { customSubstring } from "../../utils/customSubstring";
import { errorHandler } from "../../utils/errorHandler";
import { generateDiff } from "../../utils/generateDiff";

/**
 * Handles the message edit event from Discord.
 *
 * @param {Camperbot} Bot The bot's Discord instance.
 * @param {Message} oldMessage The old message data.
 * @param {Message} newMessage The new message data.
 */
export const handleMessageEdit = async (
  Bot: Camperbot,
  oldMessage: Message | PartialMessage,
  newMessage: Message | PartialMessage
) => {
  try {
    if (!oldMessage) {
      return;
    }
    const { author, content: newContent } = newMessage;
    const { content: oldContent } = oldMessage;

    // deferred interactions trigger an edit event?
    if (newMessage.interaction || oldMessage.interaction) {
      return;
    }

    if (oldContent && newContent && oldContent === newContent) {
      return;
    }

    if (!oldContent && !newContent) {
      return;
    }

    const diffContent =
      oldContent || newContent
        ? generateDiff(oldContent || "", newContent || "")
        : "This message appears to have no content.";

    const updateEmbed = new EmbedBuilder();
    updateEmbed.setTitle("Message Updated");
    updateEmbed.setAuthor({
      name: author?.tag || "unknown",
      iconURL:
        author?.displayAvatarURL() || "https:/cdn.nhcarrigan.com/profile.png",
    });
    updateEmbed.setDescription(
      `\`\`\`diff\n${customSubstring(diffContent, 4000)}\`\`\``
    );
    updateEmbed.addFields(
      {
        name: "Channel",
        value: `<#${newMessage.channel.id}>`,
      },
      {
        name: "Message Link",
        value: newMessage.url,
      }
    );
    updateEmbed.setFooter({
      text: `ID: ${author?.id || "unknown"}`,
    });

    await Bot.config.message_hook.send({ embeds: [updateEmbed] });
  } catch (err) {
    await errorHandler(Bot, err);
  }
};
