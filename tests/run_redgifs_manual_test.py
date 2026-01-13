from unittest.mock import patch, Mock
import os
import sys
sys.path.append(os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
from nodes.media_selection.media_selection import MediaSelection

# Setup
ms = MediaSelection()

# Patch get_temp_file_path to sample path
from nodes.media_selection.media_selection import get_temp_file_path

@patch('nodes.media_selection.media_selection.get_temp_file_path')
def run_test(mock_get_temp):
    mock_get_temp.return_value = os.path.join(os.path.dirname(__file__), 'tmp_redgifs_man_test.mp4')

    extracted_url = 'https://files.redgifs.com/frenchtremendousfly.mp4'
    with patch.object(MediaSelection, '_extract_redgifs_url', return_value=(extracted_url, 'video')):
        fake_content = b'FAKE_MP4_DATA' * 1024
        fake_response = Mock()
        fake_response.status_code = 200
        fake_response.content = fake_content
        fake_response.headers = {'content-type': 'video/mp4'}
        fake_response.raise_for_status = Mock()

        with patch('nodes.media_selection.media_selection.requests.get', return_value=fake_response):
            path, media_type, info = ms._download_reddit_media('https://www.redgifs.com/watch/frenchtremendousfly')

    print('path', path)
    print('media_type', media_type)
    print('info', info)
    print('exists', os.path.exists(path))

    if os.path.exists(path):
        os.remove(path)


def run_fail_test():
    sys.path.append(os.path.abspath(os.path.dirname(os.path.dirname(__file__))))
    ms = MediaSelection()
    with patch.object(MediaSelection, '_extract_redgifs_url', return_value=(None, None)):
        try:
            ms._download_reddit_media('https://www.redgifs.com/watch/nonexistent')
            print('ERROR: Expected ValueError, got success')
        except Exception as e:
            print('Caught expected error:', type(e).__name__, str(e))


if __name__ == '__main__':
    run_test()
    run_fail_test()
