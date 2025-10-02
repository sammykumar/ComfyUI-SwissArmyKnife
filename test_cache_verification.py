#!/usr/bin/env python3
"""
Cache Verification Test Script for MediaDescribe Node

This script verifies that the caching mechanism is working correctly after
recent changes to the media_describe nodes.

Tests:
1. Cache module imports correctly
2. File identifier generation works
3. Tensor identifier generation works
4. Cache set/get operations work correctly
5. Different options create different cache keys
6. All MediaDescribe options are included in cache keys
"""

from nodes.cache import get_cache, get_file_media_identifier, get_tensor_media_identifier
import json
import os

def test_cache_imports():
    """Test that cache module imports correctly"""
    print("\n=== Test 1: Cache Module Import ===")
    try:
        cache = get_cache()
        print("✅ Cache instance created successfully")
        print(f"   Cache directory: {cache.cache_dir}")
        return True
    except Exception as e:
        print(f"❌ Failed to create cache instance: {e}")
        return False

def test_file_identifier():
    """Test file identifier generation"""
    print("\n=== Test 2: File Identifier Generation ===")
    try:
        # Test with non-existent file
        test_path = 'nonexistent_file.txt'
        file_id = get_file_media_identifier(test_path)
        print(f"✅ File identifier generated for non-existent file")
        print(f"   Identifier: {file_id}")
        
        # Test with existing file
        existing_path = __file__  # This script itself
        file_id2 = get_file_media_identifier(existing_path)
        print(f"✅ File identifier generated for existing file")
        print(f"   Identifier: {file_id2[:60]}...")
        
        # Verify identifiers are different
        if file_id != file_id2:
            print("✅ Different files generate different identifiers")
        else:
            print("❌ Different files generated same identifier")
            return False
            
        return True
    except Exception as e:
        print(f"❌ File identifier generation failed: {e}")
        return False

def test_tensor_identifier():
    """Test tensor identifier generation"""
    print("\n=== Test 3: Tensor Identifier Generation ===")
    try:
        # Test with different tensor data
        tensor1 = [[[1, 2, 3], [4, 5, 6]]]
        tensor2 = [[[7, 8, 9], [10, 11, 12]]]
        
        id1 = get_tensor_media_identifier(tensor1)
        id2 = get_tensor_media_identifier(tensor2)
        
        print(f"✅ Tensor identifiers generated")
        print(f"   Tensor 1: {id1}")
        print(f"   Tensor 2: {id2}")
        
        if id1 != id2:
            print("✅ Different tensors generate different identifiers")
        else:
            print("❌ Different tensors generated same identifier")
            return False
            
        # Verify same tensor generates same identifier
        id1_duplicate = get_tensor_media_identifier(tensor1)
        if id1 == id1_duplicate:
            print("✅ Same tensor generates same identifier")
        else:
            print("❌ Same tensor generated different identifier")
            return False
            
        return True
    except Exception as e:
        print(f"❌ Tensor identifier generation failed: {e}")
        return False

def test_cache_set_get():
    """Test cache set/get operations"""
    print("\n=== Test 4: Cache Set/Get Operations ===")
    try:
        cache = get_cache()
        
        # Test basic set/get
        media_id = 'test:media:basic'
        options = {
            'describe_clothing': True,
            'describe_hair_style': False,
            'describe_bokeh': True
        }
        
        cache.set(
            media_identifier=media_id,
            gemini_model='models/gemini-2.5-flash',
            description='Test description',
            model_type='Text2Image',
            options=options
        )
        print("✅ Cache entry stored successfully")
        
        result = cache.get(
            media_identifier=media_id,
            gemini_model='models/gemini-2.5-flash',
            model_type='Text2Image',
            options=options
        )
        
        if result and result['description'] == 'Test description':
            print("✅ Cache retrieval successful")
            print(f"   Description: {result['description']}")
            print(f"   Timestamp: {result['human_timestamp']}")
            print(f"   Cache key: {result['cache_key'][:16]}...")
        else:
            print("❌ Cache retrieval failed")
            return False
            
        return True
    except Exception as e:
        print(f"❌ Cache set/get failed: {e}")
        return False

def test_options_affect_cache_key():
    """Test that different options create different cache keys"""
    print("\n=== Test 5: Options Affect Cache Key ===")
    try:
        cache = get_cache()
        media_id = 'test:media:options'
        
        # Store with first set of options
        options1 = {
            'describe_clothing': True,
            'describe_hair_style': False,
            'describe_bokeh': True
        }
        
        cache.set(
            media_identifier=media_id,
            gemini_model='models/gemini-2.5-flash',
            description='Description with options1',
            model_type='Text2Image',
            options=options1
        )
        
        # Try to get with different options
        options2 = {
            'describe_clothing': False,  # Changed
            'describe_hair_style': False,
            'describe_bokeh': True
        }
        
        result = cache.get(
            media_identifier=media_id,
            gemini_model='models/gemini-2.5-flash',
            model_type='Text2Image',
            options=options2
        )
        
        if result is None:
            print("✅ Different options correctly create different cache keys")
        else:
            print("❌ Different options did not create different cache keys")
            return False
            
        # Verify we can retrieve with original options
        result2 = cache.get(
            media_identifier=media_id,
            gemini_model='models/gemini-2.5-flash',
            model_type='Text2Image',
            options=options1
        )
        
        if result2 and result2['description'] == 'Description with options1':
            print("✅ Original options still retrieve correct cached result")
        else:
            print("❌ Could not retrieve with original options")
            return False
            
        return True
    except Exception as e:
        print(f"❌ Options cache key test failed: {e}")
        return False

def test_all_mediadescribe_options():
    """Test that all MediaDescribe options are included in cache keys"""
    print("\n=== Test 6: All MediaDescribe Options in Cache ===")
    
    # Define all options that should affect caching
    image_options = [
        'describe_clothing',
        'change_clothing_color',
        'describe_hair_style',
        'describe_bokeh',
        'describe_subject'
    ]
    
    video_options = [
        'describe_clothing',
        'change_clothing_color',
        'describe_hair_style',
        'describe_bokeh',
        'describe_subject',
        'replace_action_with_twerking',  # Video-specific
        'max_duration'  # Video-specific
    ]
    
    try:
        cache = get_cache()
        
        # Test image options
        print("\n--- Testing Image Options ---")
        base_image_options = {opt: False for opt in image_options}
        media_id_img = 'test:media:image_options'
        
        cache.set(
            media_identifier=media_id_img,
            gemini_model='models/gemini-2.5-flash',
            description='Base image description',
            model_type='Text2Image',
            options=base_image_options
        )
        
        # Test each option individually
        for option in image_options:
            modified_options = base_image_options.copy()
            modified_options[option] = True  # Change one option
            
            result = cache.get(
                media_identifier=media_id_img,
                gemini_model='models/gemini-2.5-flash',
                model_type='Text2Image',
                options=modified_options
            )
            
            if result is None:
                print(f"✅ '{option}' affects image cache key")
            else:
                print(f"❌ '{option}' does NOT affect image cache key")
                return False
        
        # Test video options
        print("\n--- Testing Video Options ---")
        base_video_options = {opt: False if opt != 'max_duration' else 5.0 for opt in video_options}
        media_id_vid = 'test:media:video_options'
        
        cache.set(
            media_identifier=media_id_vid,
            gemini_model='models/gemini-2.5-flash',
            description='Base video description',
            model_type='',  # Videos don't use model_type
            options=base_video_options
        )
        
        # Test each option individually
        for option in video_options:
            modified_options = base_video_options.copy()
            if option == 'max_duration':
                modified_options[option] = 10.0  # Change duration
            else:
                modified_options[option] = True  # Change boolean option
            
            result = cache.get(
                media_identifier=media_id_vid,
                gemini_model='models/gemini-2.5-flash',
                model_type='',
                options=modified_options
            )
            
            if result is None:
                print(f"✅ '{option}' affects video cache key")
            else:
                print(f"❌ '{option}' does NOT affect video cache key")
                return False
        
        print("\n✅ All MediaDescribe options correctly affect cache keys")
        return True
        
    except Exception as e:
        print(f"❌ MediaDescribe options test failed: {e}")
        return False

def test_cache_info():
    """Test cache info retrieval"""
    print("\n=== Test 7: Cache Info ===")
    try:
        cache = get_cache()
        info = cache.get_cache_info()
        
        print(f"✅ Cache info retrieved:")
        print(f"   Directory: {info['cache_dir']}")
        print(f"   Entries: {info['entries']}")
        print(f"   Total size: {info['total_size_mb']} MB")
        
        return True
    except Exception as e:
        print(f"❌ Cache info test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 70)
    print("CACHE VERIFICATION TEST SUITE FOR MEDIADESCRIBE")
    print("=" * 70)
    
    tests = [
        test_cache_imports,
        test_file_identifier,
        test_tensor_identifier,
        test_cache_set_get,
        test_options_affect_cache_key,
        test_all_mediadescribe_options,
        test_cache_info
    ]
    
    results = []
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"\n❌ Test failed with exception: {e}")
            results.append(False)
    
    # Summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    passed = sum(results)
    total = len(results)
    print(f"Tests passed: {passed}/{total}")
    
    if passed == total:
        print("\n✅ ALL TESTS PASSED - CACHING MECHANISM IS WORKING CORRECTLY")
        return 0
    else:
        print(f"\n❌ {total - passed} TEST(S) FAILED")
        return 1

if __name__ == "__main__":
    exit(main())
