// import { useState } from "react";
// import { Pressable, Text, TextInput, View } from "react-native";
// import FavoriteButton from "@/components/favorites/FavoritesButton";

// const QUICK_MESSAGES = [
//   "Is this still available?",
//   "What's the last price?",
//   "Can I make a half payment?",
// ];

// type Props = {
//   listingId: string;
//   ownerId: string;
//   onSendMessage: (text: string) => Promise<void>;
//   sending?: boolean;
// };

// export default function BuyerListingActions({
//   listingId,
//   ownerId,
//   onSendMessage,
//   sending = false,
// }: Props) {
//   const [message, setMessage] = useState("");

//   return (
//     <View className="mt-4 rounded-3xl border border-[#E5E7EB] bg-white p-4">
//       <View className="mb-3 flex-row items-center justify-between">
//         <FavoriteButton listingId={listingId} showText />
//       </View>

//       <View className="mb-3 flex-row flex-wrap gap-2">
//         {QUICK_MESSAGES.map((item) => (
//           <Pressable
//             key={item}
//             onPress={() => setMessage(item)}
//             className="rounded-full border border-[#D0D5DD] bg-[#F9FAFB] px-3 py-2"
//           >
//             <Text className="text-[12px] text-[#344054]">{item}</Text>
//           </Pressable>
//         ))}
//       </View>

//       <View className="flex-row items-center gap-2">
//         <TextInput
//           value={message}
//           onChangeText={setMessage}
//           placeholder="Type your message..."
//           placeholderTextColor="#98A2B3"
//           className="flex-1 rounded-2xl border border-[#D0D5DD] px-4 py-3 text-[#111827]"
//         />

//         <Pressable
//           onPress={() => onSendMessage(message)}
//           disabled={sending || !message.trim()}
//           className={`rounded-2xl px-4 py-3 ${
//             sending || !message.trim() ? "bg-[#D0D5DD]" : "bg-[#8A715D]"
//           }`}
//         >
//           <Text className="font-semibold text-white">
//             {sending ? "..." : "Send"}
//           </Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// }