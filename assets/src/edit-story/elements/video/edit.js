/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import styled from 'styled-components';
import { useCallback, useState } from 'react';

/**
 * Internal dependencies
 */
import {
  elementFillContent,
  CropBox,
  getMediaProps,
  EditPanMovable,
  ScalePanel,
  MEDIA_MASK_OPACITY,
} from '../shared';
import { useStory } from '../../app';
import StoryPropTypes from '../../types';
import { videoWithScale } from './util';

const Element = styled.div`
  ${elementFillContent}
`;

const FadedVideo = styled.video`
  position: absolute;
  opacity: ${({ opacity }) =>
    opacity ? opacity * MEDIA_MASK_OPACITY : MEDIA_MASK_OPACITY};
  pointer-events: none;
  ${videoWithScale}
  max-width: initial;
  max-height: initial;
`;

// Opacity of the mask is reduced depending on the opacity assigned to the video.
const CropVideo = styled.video`
  position: absolute;
  ${videoWithScale}
  max-width: initial;
  max-height: initial;
  opacity: ${({ opacity }) =>
    opacity ? 1 - (1 - opacity) / (1 - opacity * MEDIA_MASK_OPACITY) : null};
`;

// Opacity is adjusted so that the double image opacity would equal
// the opacity assigned to the video.
function VideoEdit({
  element: { id, src, origRatio, scale, focalX, focalY, mimeType, opacity },
  box: { x, y, width, height, rotationAngle },
}) {
  const [fullVideo, setFullVideo] = useState(null);
  const [croppedVideo, setCroppedVideo] = useState(null);

  const {
    actions: { updateElementById },
  } = useStory();
  const setProperties = useCallback(
    (properties) => updateElementById({ elementId: id, properties }),
    [id, updateElementById]
  );

  const videoProps = getMediaProps(
    width,
    height,
    scale,
    focalX,
    focalY,
    origRatio
  );

  return (
    <Element>
      <FadedVideo
        ref={setFullVideo}
        draggable={false}
        {...videoProps}
        opacity={opacity / 100}
      >
        <source src={src} type={mimeType} />
      </FadedVideo>
      <CropBox>
        <CropVideo
          ref={setCroppedVideo}
          draggable={false}
          src={src}
          {...videoProps}
          opacity={opacity / 100}
        />
      </CropBox>

      {fullVideo && croppedVideo && (
        <EditPanMovable
          setProperties={setProperties}
          fullMedia={fullVideo}
          croppedMedia={croppedVideo}
          x={x}
          y={y}
          width={width}
          height={height}
          rotationAngle={rotationAngle}
          offsetX={videoProps.offsetX}
          offsetY={videoProps.offsetY}
          mediaWidth={videoProps.width}
          mediaHeight={videoProps.height}
        />
      )}

      <ScalePanel
        setProperties={setProperties}
        x={x}
        y={y}
        width={width}
        height={height}
        scale={scale || 100}
      />
    </Element>
  );
}

VideoEdit.propTypes = {
  element: StoryPropTypes.elements.video.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default VideoEdit;
