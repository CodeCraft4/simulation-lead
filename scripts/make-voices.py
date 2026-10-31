"""Generate the Urdu call voices (MP3) and src/data/callScripts.ts.

Voices are Microsoft neural Urdu (Pakistan): Asad (male) for the agent, Uzma (female) for women
leads. Men leads use Asad at a lower pitch so the two sides of the call still sound different.

    pip install edge-tts
    python scripts/make-voices.py

Edit the lines below, run it again, and commit the new files in public/audio/calls/.
"""

import asyncio
import json
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "public" / "audio" / "calls"
TS_FILE = ROOT / "src" / "data" / "callScripts.ts"

AGENT = {"voice": "ur-PK-AsadNeural", "rate": "-4%", "pitch": "+0Hz"}
WOMAN = {"voice": "ur-PK-UzmaNeural", "rate": "-4%", "pitch": "+0Hz"}
MAN = {"voice": "ur-PK-AsadNeural", "rate": "-8%", "pitch": "-12Hz"}

# who, Urdu text spoken by the voice, Roman Urdu caption shown on screen
CALLS = {
    "sana": (WOMAN, "Sana", [
        ("agent", "السلام علیکم سنا صاحبہ، میں عثمان بات کر رہا ہوں، کریسنٹ ہائٹس سے۔ آپ نے تین بیڈ روم اپارٹمنٹ کی معلومات مانگی تھیں۔",
         "Assalam o Alaikum Sana sahiba, main Usman, Crescent Heights se. Aap ne 3 bedroom apartment ki maloomat maangi thi."),
        ("lead", "وعلیکم السلام۔ جی بالکل، مجھے تین بیڈ روم کا پیمنٹ پلان جاننا ہے۔",
         "Wa Alaikum Assalam. Ji bilkul, mujhe 3 bedroom ka payment plan jaanna hai."),
        ("agent", "ضرور۔ تین بیڈ روم کی قیمت تقریباً دو کروڑ روپے ہے۔ بیس فیصد ڈاؤن پیمنٹ، اور باقی رقم تین سال کی آسان اقساط میں۔",
         "Zaroor. Qeemat taqreeban 2 crore hai. 20% down payment, baaqi 3 saal ki aasaan aqsaat mein."),
        ("lead", "یہ تو کافی مناسب ہے۔ کیا میں سائٹ خود آ کر دیکھ سکتی ہوں؟",
         "Yeh to kaafi munasib hai. Kya main site khud aa kar dekh sakti hoon?"),
        ("agent", "جی بالکل۔ کیا ہفتہ، سات نومبر، صبح گیارہ بجے آپ کے لیے مناسب رہے گا؟",
         "Ji bilkul. Kya Haftah, 7 November, subah 11 baje munasib rahega?"),
        ("lead", "جی، ہفتے کو گیارہ بجے ٹھیک ہے۔",
         "Ji, Haftay ko 11 baje theek hai."),
        ("agent", "بہت شکریہ۔ میں ابھی واٹس ایپ پر لوکیشن اور پیمنٹ پلان بھیج دیتا ہوں۔ اللہ حافظ۔",
         "Bohat shukriya. Main abhi WhatsApp par location aur payment plan bhej deta hoon. Allah Hafiz."),
        ("lead", "شکریہ، اللہ حافظ۔",
         "Shukriya, Allah Hafiz."),
    ]),
    "ali": (MAN, "Ali", [
        ("agent", "السلام علیکم علی صاحب، میں عثمان، کریسنٹ ہائٹس سے۔ آپ نے کال بیک کا وقت لیا تھا۔",
         "Assalam o Alaikum Ali sahab, main Usman, Crescent Heights se. Aap ne call back ka waqt liya tha."),
        ("lead", "جی وعلیکم السلام۔ مجھے ڈی ایچ اے کے قریب دو کروڑ تک کا گھر چاہیے۔",
         "Ji Wa Alaikum Assalam. Mujhe DHA ke qareeb 2 crore tak ka ghar chahiye."),
        ("agent", "ہمارے پاس اس بجٹ میں بہترین آپشن موجود ہیں۔ میں تفصیل ابھی واٹس ایپ پر بھیج دیتا ہوں۔",
         "Is budget mein behtareen options maujood hain. Main tafseel abhi WhatsApp par bhej deta hoon."),
    ]),
    "bilal": (MAN, "Bilal", [
        ("agent", "السلام علیکم بلال صاحب، عثمان بات کر رہا ہوں کریسنٹ ہائٹس سے۔ آپ نے ہمارے میسج کا جواب دیا تھا۔",
         "Assalam o Alaikum Bilal sahab, Usman, Crescent Heights se. Aap ne hamare message ka jawab diya tha."),
        ("lead", "جی، بحریہ میں تین بیڈ روم کی قیمت کیا ہے؟",
         "Ji, Bahria mein 3 bedroom ki qeemat kya hai?"),
        ("agent", "تقریباً ڈھائی کروڑ، آسان اقساط کے ساتھ۔ کیا اسی ہفتے سائٹ وزٹ رکھ لیں؟",
         "Taqreeban dhai crore, aasaan aqsaat ke saath. Kya isi hafte site visit rakh lein?"),
    ]),
    "fatima": (WOMAN, "Fatima", [
        ("agent", "السلام علیکم فاطمہ صاحبہ، میں عثمان، کریسنٹ ہائٹس سے بات کر رہا ہوں۔",
         "Assalam o Alaikum Fatima sahiba, main Usman, Crescent Heights se."),
        ("lead", "جی، میرا بجٹ ڈیڑھ کروڑ سے کم ہے۔ کوئی آپشن ہے؟",
         "Ji, mera budget dedh crore se kam hai. Koi option hai?"),
        ("agent", "جی بالکل، جوہر ٹاؤن میں دو بیڈ روم اپارٹمنٹ موجود ہیں۔ میں تفصیل بھیج دیتا ہوں۔",
         "Ji bilkul, Johar Town mein 2 bedroom apartments maujood hain. Main tafseel bhej deta hoon."),
    ]),
    "zainab": (WOMAN, "Zainab", [
        ("agent", "السلام علیکم زینب صاحبہ، آج تین بجے آپ کا سائٹ وزٹ ہے، بس کنفرم کرنا تھا۔",
         "Assalam o Alaikum Zainab sahiba, aaj 3 baje aap ka site visit hai, bas confirm karna tha."),
        ("lead", "جی، میں تین بجے پہنچ جاؤں گی۔",
         "Ji, main 3 baje pohanch jaungi."),
        ("agent", "بہت شکریہ، میں گیٹ پر آپ کا انتظار کروں گا۔ اللہ حافظ۔",
         "Bohat shukriya, main gate par aap ka intezar karunga. Allah Hafiz."),
    ]),
}

# edge-tts default output: 48 kbit/s mono MP3, so the length follows from the file size.
BYTES_PER_MS = 48_000 / 8 / 1000


async def speak(text: str, voice: dict, out: Path) -> int:
    await edge_tts.Communicate(text, voice["voice"], rate=voice["rate"], pitch=voice["pitch"]).save(str(out))
    return round(out.stat().st_size / BYTES_PER_MS)


async def main() -> None:
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    scripts = {}
    for lead_id, (lead_voice, name, lines) in CALLS.items():
        out_lines = []
        for i, (who, urdu, caption) in enumerate(lines, start=1):
            file = AUDIO_DIR / f"{lead_id}-{i}.mp3"
            ms = await speak(urdu, AGENT if who == "agent" else lead_voice, file)
            out_lines.append({"who": "Usman" if who == "agent" else name, "agent": who == "agent", "text": caption, "src": f"/audio/calls/{file.name}", "ms": ms})
            print(f"{file.name}  {ms} ms")
        scripts[lead_id] = out_lines

    TS_FILE.write_text(
        "// Generated by scripts/make-voices.py. Edit the lines there and run it again.\n\n"
        "export interface CallLine {\n  who: string\n  /** True when the agent speaks. */\n  agent: boolean\n"
        "  /** Roman Urdu caption shown while the line plays. */\n  text: string\n  src: string\n  /** Length of the audio. */\n  ms: number\n}\n\n"
        f"export const CALL_SCRIPTS: Record<string, CallLine[]> = {json.dumps(scripts, ensure_ascii=False, indent=2)}\n",
        encoding="utf-8",
    )
    print(f"wrote {TS_FILE.relative_to(ROOT)}")


asyncio.run(main())
