#!/usr/bin/env python3
"""
CivitAI Integration Debug Helper

This script helps debug CivitAI integration issues in ComfyUI-SwissArmyKnife.
"""

import os
import sys
sys.path.append(os.path.dirname(__file__))

from nodes.debug_utils import setup_logging, get_logger

# Setup logger
setup_logging()
logger = get_logger(__name__)

def check_environment():
    """Check environment setup for CivitAI integration"""
    logger.info("🔍 CivitAI Integration Debug Helper")
    logger.info("=" * 50)

    # Check current directory
    cwd = os.getcwd()
    logger.info(f"📁 Current directory: {cwd}")

    # Check for .env files
    env_files = ['.env', '.env.local', '.env.production']
    logger.info("\n📄 Environment Files:")

    env_file_found = False
    civitai_config_found = False

    for env_file in env_files:
        if os.path.exists(env_file):
            env_file_found = True
            logger.info(f"  ✅ Found: {env_file}")
            try:
                with open(env_file, 'r') as f:
                    content = f.read()
                    if 'CIVITAI' in content.upper():
                        civitai_config_found = True
                        logger.info("    ✅ Contains CivitAI configuration")
                        # Show the lines with CIVITAI (masked)
                        for line_num, line in enumerate(content.split('\n'), 1):
                            if 'CIVITAI' in line.upper():
                                if '=' in line and not line.strip().startswith('#'):
                                    key, value = line.split('=', 1)
                                    masked_value = value[:8] + '...' + value[-4:] if len(value) > 12 else '***'
                                    logger.info(f"    📝 Line {line_num}: {key}={masked_value}")
                                else:
                                    logger.info(f"    📝 Line {line_num}: {line}")
                    else:
                        logger.warning("    ❌ No CivitAI configuration found")
            except Exception as e:
                logger.error(f"    ❌ Error reading file: {e}")
        else:
            logger.warning(f"  ❌ Not found: {env_file}")

    # Check environment variables
    logger.info("\n🌍 Environment Variables:")
    civitai_vars = [k for k in os.environ.keys() if 'civit' in k.lower()]
    if civitai_vars:
        logger.info(f"  ✅ CivitAI-related variables found: {len(civitai_vars)}")
        for var in civitai_vars:
            value = os.environ[var]
            masked_value = value[:8] + '...' + value[-4:] if len(value) > 12 else '***'
            logger.info(f"    📝 {var}={masked_value}")
    else:
        logger.warning("  ❌ No CivitAI-related environment variables found")

    # Test service initialization
    logger.info("\n🔧 Service Test:")
    try:
        from nodes.civitai_service import CivitAIService
        service = CivitAIService()
        if service.api_key:
            logger.info("  ✅ CivitAI service initialized with API key")
        else:
            logger.warning("  ❌ CivitAI service has no API key")
    except Exception as e:
        logger.error(f"  ❌ Error initializing service: {e}")

    # Recommendations
    logger.info("\n💡 Recommendations:")

    if not env_file_found:
        logger.info("  1. Create a .env file in your project root:")
        logger.info("     echo 'CIVITAI_API_KEY=your_api_key_here' > .env")
    elif not civitai_config_found:
        logger.info("  1. Add CivitAI API key to your .env file:")
        logger.info("     echo 'CIVITAI_API_KEY=your_api_key_here' >> .env")

    if not civitai_vars:
        logger.info("  2. Get your CivitAI API key from: https://civitai.com/user/account")
        logger.info("  3. Set the environment variable or add to .env file")

    logger.info("  4. Restart ComfyUI after setting the API key")
    logger.info("  5. Test with a known LoRA file from CivitAI")

def test_api_key(api_key):
    """Test a CivitAI API key"""
    if not api_key:
        logger.error("❌ No API key provided")
        return False

    logger.info(f"🧪 Testing API key: {api_key[:8]}...{api_key[-4:]}")

    try:
        import requests
        url = "https://civitai.com/api/v1/models"
        headers = {"Authorization": f"Bearer {api_key}"}

        logger.info("📡 Making test request to CivitAI API...")
        response = requests.get(url, headers=headers, timeout=10, params={"limit": 1})

        logger.info(f"📊 Response status: {response.status_code}")

        if response.status_code == 200:
            logger.info("✅ API key is valid!")
            return True
        elif response.status_code == 401:
            logger.error("❌ API key is invalid or expired")
            return False
        else:
            logger.warning(f"⚠️  Unexpected response: {response.status_code}")
            logger.warning(f"Response: {response.text[:200]}")
            return False

    except Exception as e:
        logger.error(f"❌ Error testing API key: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Test provided API key
        api_key = sys.argv[1]
        test_api_key(api_key)
    else:
        # Check environment
        check_environment()

        # Offer to test API key
        api_key = os.environ.get("CIVITAI_API_KEY")
        if api_key:
            logger.info("\n" + "="*50)
            test_api_key(api_key)