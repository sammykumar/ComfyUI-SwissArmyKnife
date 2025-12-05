import os
import io
import pytest
from unittest.mock import patch, Mock

from nodes.media_selection.media_selection import MediaSelection


@patch('nodes.media_selection.media_selection.get_temp_file_path')
def test_redgifs_direct_download_success(mock_get_temp_path):
    # Provide a temp path to write to
    temp_path = os.path.join(os.path.dirname(__file__), 'tmp_redgifs_test.mp4')
    mock_get_temp_path.return_value = temp_path

    ms = MediaSelection()

    # Mock extraction to return a sample mp4 URL
    extracted_url = 'https://files.redgifs.com/frenchtremendousfly.mp4'

    with patch.object(MediaSelection, '_extract_redgifs_url', return_value=(extracted_url, 'video')):
        # Mock the requests.get for the direct file
        fake_content = b'FAKE_MP4_DATA' * 1024
        fake_response = Mock()
        fake_response.status_code = 200
        fake_response.content = fake_content
        fake_response.headers = {'content-type': 'video/mp4'}
        fake_response.raise_for_status = Mock()

        with patch('nodes.media_selection.media_selection.requests.get', return_value=fake_response):
            path, media_type, info = ms._download_reddit_media('https://www.redgifs.com/watch/frenchtremendousfly')

    # Validate outputs
    assert media_type == 'video'
    assert path == temp_path
    assert info['media_url'] == extracted_url
    assert os.path.exists(path)

    # Clean up
    os.remove(path)


@patch('nodes.media_selection.media_selection.get_temp_file_path')
def test_redgifs_direct_download_fail(mock_get_temp_path):
    ms = MediaSelection()
    with patch.object(MediaSelection, '_extract_redgifs_url', return_value=(None, None)):
        with pytest.raises(Exception) as excinfo:
            ms._download_reddit_media('https://www.redgifs.com/watch/nonexistent')
        assert 'Could not extract a direct media URL' in str(excinfo.value)
