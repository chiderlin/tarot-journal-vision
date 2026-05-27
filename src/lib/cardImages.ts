/**
 * Card image URL maps — all images served from Supabase S3 Storage (card-assets bucket).
 *
 * Tarot path layout:
 *   tarot/major_arcana/{key}.png
 *   tarot/{suit}/{suit}_{rank}.png
 *
 * Lenormand path layout:
 *   lenormand/{number}-{name}.png
 */
import { cardAssetUrl } from '@/lib/storage';

// ── Tarot ──────────────────────────────────────────────────────────────────

export const tarotImages: Record<string, string> = {
  // Major Arcana
  fool: cardAssetUrl('tarot/major_arcana/fool.png'),
  magician: cardAssetUrl('tarot/major_arcana/magician.png'),
  priestess: cardAssetUrl('tarot/major_arcana/priestess.png'),
  empress: cardAssetUrl('tarot/major_arcana/empress.png'),
  emperor: cardAssetUrl('tarot/major_arcana/emperor.png'),
  hierophant: cardAssetUrl('tarot/major_arcana/hierophant.png'),
  lovers: cardAssetUrl('tarot/major_arcana/lovers.png'),
  chariot: cardAssetUrl('tarot/major_arcana/chariot.png'),
  justice: cardAssetUrl('tarot/major_arcana/justice.png'),
  hermit: cardAssetUrl('tarot/major_arcana/hermit.png'),
  fortune: cardAssetUrl('tarot/major_arcana/fortune.png'),
  strength: cardAssetUrl('tarot/major_arcana/strength.png'),
  hanged: cardAssetUrl('tarot/major_arcana/hanged.png'),
  temperance: cardAssetUrl('tarot/major_arcana/temperance.png'),
  devil: cardAssetUrl('tarot/major_arcana/devil.png'),
  tower: cardAssetUrl('tarot/major_arcana/tower.png'),
  sun: cardAssetUrl('tarot/major_arcana/sun.png'),
  judgement: cardAssetUrl('tarot/major_arcana/judgement.png'),
  world: cardAssetUrl('tarot/major_arcana/world.png'),
  death: cardAssetUrl('tarot/major_arcana/death.png'),
  star: cardAssetUrl('tarot/major_arcana/star.png'),
  moon: cardAssetUrl('tarot/major_arcana/moon.png'),

  // Wands
  wands_ace: cardAssetUrl('tarot/wands/wands_ace.png'),
  wands_2: cardAssetUrl('tarot/wands/wands_2.png'),
  wands_3: cardAssetUrl('tarot/wands/wands_3.png'),
  wands_4: cardAssetUrl('tarot/wands/wands_4.png'),
  wands_5: cardAssetUrl('tarot/wands/wands_5.png'),
  wands_6: cardAssetUrl('tarot/wands/wands_6.png'),
  wands_7: cardAssetUrl('tarot/wands/wands_7.png'),
  wands_8: cardAssetUrl('tarot/wands/wands_8.png'),
  wands_9: cardAssetUrl('tarot/wands/wands_9.png'),
  wands_10: cardAssetUrl('tarot/wands/wands_10.png'),
  wands_page: cardAssetUrl('tarot/wands/wands_page.png'),
  wands_knight: cardAssetUrl('tarot/wands/wands_knight.png'),
  wands_queen: cardAssetUrl('tarot/wands/wands_queen.png'),
  wands_king: cardAssetUrl('tarot/wands/wands_king.png'),

  // Cups
  cups_ace: cardAssetUrl('tarot/cups/cups_ace.png'),
  cups_2: cardAssetUrl('tarot/cups/cups_2.png'),
  cups_3: cardAssetUrl('tarot/cups/cups_3.png'),
  cups_4: cardAssetUrl('tarot/cups/cups_4.png'),
  cups_5: cardAssetUrl('tarot/cups/cups_5.png'),
  cups_6: cardAssetUrl('tarot/cups/cups_6.png'),
  cups_7: cardAssetUrl('tarot/cups/cups_7.png'),
  cups_8: cardAssetUrl('tarot/cups/cups_8.png'),
  cups_9: cardAssetUrl('tarot/cups/cups_9.png'),
  cups_10: cardAssetUrl('tarot/cups/cups_10.png'),
  cups_page: cardAssetUrl('tarot/cups/cups_page.png'),
  cups_knight: cardAssetUrl('tarot/cups/cups_knight.png'),
  cups_queen: cardAssetUrl('tarot/cups/cups_queen.png'),
  cups_king: cardAssetUrl('tarot/cups/cups_king.png'),

  // Swords
  swords_ace: cardAssetUrl('tarot/swords/swords_ace.png'),
  swords_2: cardAssetUrl('tarot/swords/swords_2.png'),
  swords_3: cardAssetUrl('tarot/swords/swords_3.png'),
  swords_4: cardAssetUrl('tarot/swords/swords_4.png'),
  swords_5: cardAssetUrl('tarot/swords/swords_5.png'),
  swords_6: cardAssetUrl('tarot/swords/swords_6.png'),
  swords_7: cardAssetUrl('tarot/swords/swords_7.png'),
  swords_8: cardAssetUrl('tarot/swords/swords_8.png'),
  swords_9: cardAssetUrl('tarot/swords/swords_9.png'),
  swords_10: cardAssetUrl('tarot/swords/swords_10.png'),
  swords_page: cardAssetUrl('tarot/swords/swords_page.png'),
  swords_knight: cardAssetUrl('tarot/swords/swords_knight.png'),
  swords_queen: cardAssetUrl('tarot/swords/swords_queen.png'),
  swords_king: cardAssetUrl('tarot/swords/swords_king.png'),

  // Pentacles
  pentacles_ace: cardAssetUrl('tarot/pentacles/pentacles_ace.png'),
  pentacles_2: cardAssetUrl('tarot/pentacles/pentacles_2.png'),
  pentacles_3: cardAssetUrl('tarot/pentacles/pentacles_3.png'),
  pentacles_4: cardAssetUrl('tarot/pentacles/pentacles_4.png'),
  pentacles_5: cardAssetUrl('tarot/pentacles/pentacles_5.png'),
  pentacles_6: cardAssetUrl('tarot/pentacles/pentacles_6.png'),
  pentacles_7: cardAssetUrl('tarot/pentacles/pentacles_7.png'),
  pentacles_8: cardAssetUrl('tarot/pentacles/pentacles_8.png'),
  pentacles_9: cardAssetUrl('tarot/pentacles/pentacles_9.png'),
  pentacles_10: cardAssetUrl('tarot/pentacles/pentacles_10.png'),
  pentacles_page: cardAssetUrl('tarot/pentacles/pentacles_page.png'),
  pentacles_knight: cardAssetUrl('tarot/pentacles/pentacles_knight.png'),
  pentacles_queen: cardAssetUrl('tarot/pentacles/pentacles_queen.png'),
  pentacles_king: cardAssetUrl('tarot/pentacles/pentacles_king.png'),
};

// ── Lenormand ──────────────────────────────────────────────────────────────

export const lenormandImages: Record<string, string> = {
  rider: cardAssetUrl('lenormand/1-rider.png'),
  clover: cardAssetUrl('lenormand/2-clover.png'),
  ship: cardAssetUrl('lenormand/3-ship.png'),
  house: cardAssetUrl('lenormand/4-house.png'),
  tree: cardAssetUrl('lenormand/5-tree.png'),
  cloud: cardAssetUrl('lenormand/6-cloud.png'),
  snake: cardAssetUrl('lenormand/7-snake.png'),
  coffin: cardAssetUrl('lenormand/8-coffin.png'),
  bouquet: cardAssetUrl('lenormand/9-bouquet.png'),
  scythe: cardAssetUrl('lenormand/10-scythe.png'),
  whip: cardAssetUrl('lenormand/11-whip.png'),
  birds: cardAssetUrl('lenormand/12-birds.png'),
  child: cardAssetUrl('lenormand/13-child.png'),
  fox: cardAssetUrl('lenormand/14-fox.png'),
  bear: cardAssetUrl('lenormand/15-bear.png'),
  star: cardAssetUrl('lenormand/16-star.png'),
  stork: cardAssetUrl('lenormand/17-stork.png'),
  dog: cardAssetUrl('lenormand/18-dog.png'),
  tower: cardAssetUrl('lenormand/19-tower.png'),
  garden: cardAssetUrl('lenormand/20-garden.png'),
  mountain: cardAssetUrl('lenormand/21-mountain.png'),
  crossroads: cardAssetUrl('lenormand/22-crossroads.png'),
  mice: cardAssetUrl('lenormand/23-mice.png'),
  heart: cardAssetUrl('lenormand/24-heart.png'),
  ring: cardAssetUrl('lenormand/25-ring.png'),
  book: cardAssetUrl('lenormand/26-book.png'),
  letter: cardAssetUrl('lenormand/27-letter.png'),
  gentleman: cardAssetUrl('lenormand/28-gentleman.png'),
  lady: cardAssetUrl('lenormand/29-lady.png'),
  lily: cardAssetUrl('lenormand/30-lily.png'),
  sun: cardAssetUrl('lenormand/31-sun.png'),
  moon: cardAssetUrl('lenormand/32-moon.png'),
  key: cardAssetUrl('lenormand/33-key.png'),
  fish: cardAssetUrl('lenormand/34-fish.png'),
  anchor: cardAssetUrl('lenormand/35-anchor.png'),
  cross: cardAssetUrl('lenormand/36-cross.png'),
};
