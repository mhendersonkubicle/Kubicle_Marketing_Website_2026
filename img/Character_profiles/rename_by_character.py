"""Rename portrait files from sequential numbering to character.variant format."""
import os

PORTRAITS_DIR = r"C:\Users\Mark\Desktop\Character_profiles\portraits"

# Each tuple: (new_character_id, [source_file_basenames_in_variant_order])
CHARACTERS = [
    ("female_01", ["female_01", "female_06", "female_16"]),
    ("female_02", ["female_02"]),
    ("female_03", ["female_03", "female_11", "female_19"]),
    ("female_04", ["female_04", "female_14"]),
    ("female_05", ["female_05"]),
    ("female_06", ["female_07", "female_17"]),
    ("female_07", ["female_08", "female_18"]),
    ("female_08", ["female_09", "female_15", "female_20"]),
    ("female_09", ["female_10", "female_13"]),
    ("female_10", ["female_12"]),
    ("female_11", ["female_21"]),
    ("male_01",   ["male_01", "male_05", "male_14"]),
    ("male_02",   ["male_02", "male_07", "male_11"]),
    ("male_03",   ["male_03"]),
    ("male_04",   ["male_04", "male_12", "male_17"]),
    ("male_05",   ["male_06"]),
    ("male_06",   ["male_08", "male_13", "male_15"]),
    ("male_07",   ["male_09"]),
    ("male_08",   ["male_10", "male_19"]),
    ("male_09",   ["male_16"]),
    ("male_10",   ["male_18"]),
]


def main():
    # Validate: every existing file accounted for, no duplicates.
    sources = [s for _, srcs in CHARACTERS for s in srcs]
    if len(sources) != len(set(sources)):
        raise RuntimeError(f"Duplicate sources in CHARACTERS: {sources}")

    existing = {
        os.path.splitext(f)[0]
        for f in os.listdir(PORTRAITS_DIR)
        if f.endswith(".png") and (f.startswith("male_") or f.startswith("female_"))
    }
    missing = set(sources) - existing
    extra = existing - set(sources)
    if missing:
        raise RuntimeError(f"Sources missing on disk: {missing}")
    if extra:
        raise RuntimeError(f"Files on disk not in plan: {extra}")

    # Two-phase rename to avoid any collision risk: first to .tmp.png, then to final.
    plan = []
    for char_id, srcs in CHARACTERS:
        for i, src in enumerate(srcs):
            letter = chr(ord("a") + i)
            final = f"{char_id}.{letter}.png"
            plan.append((src + ".png", final))

    print(f"Renaming {len(plan)} files...")
    for src, final in plan:
        sp = os.path.join(PORTRAITS_DIR, src)
        tp = os.path.join(PORTRAITS_DIR, src + ".tmp")
        os.rename(sp, tp)

    for src, final in plan:
        tp = os.path.join(PORTRAITS_DIR, src + ".tmp")
        fp = os.path.join(PORTRAITS_DIR, final)
        os.rename(tp, fp)
        print(f"  {src} -> {final}")

    print(f"\nDone.")


if __name__ == "__main__":
    main()
