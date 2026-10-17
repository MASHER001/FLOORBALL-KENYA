"""
One-time bucket setup for Supabase Storage.
Run from backend/:  .\\venv\\Scripts\\python.exe setup_buckets.py
"""

from app.database.supabase import get_supabase_admin

BUCKETS = {
    "gallery": False,        # private, signed URL access
    "products": True,        # public product images
    "news": True,            # public cover images
    "certificates": False,   # private (official qualifications)
}

sb = get_supabase_admin()

for name, is_public in BUCKETS.items():
    try:
        # supabase-py 2.23 expects the name as a keyword argument
        sb.storage.create_bucket(
            id=name,
            name=name,
            options={"public": is_public},
        )
        print(f"created: {name} (public={is_public})")
    except Exception as exc:
        print(f"skip {name}: {exc}")