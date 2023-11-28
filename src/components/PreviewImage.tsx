import React, { useState, useEffect } from 'react'

const PreviewImage = ({ blobPromise }: { blobPromise: Promise<Blob> }) => {
  const [imageSrc, setImageSrc] = useState<string>()

  useEffect(() => {
    const loadImage = async () => {
      try {
        const blob = await blobPromise
        const imageUrl = URL.createObjectURL(blob)
        setImageSrc(imageUrl)
      } catch (error) {
        console.error('Failed to load image:', error)
      }
    }

    loadImage()
  }, [blobPromise])

  useEffect(() => {
    return () => {
      // Clean up the URL object when component unmounts
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc)
      }
    }
  }, [])

  return <div>{imageSrc ? <img src={imageSrc} alt="Image" /> : <div>Loading image...</div>}</div>
}

export default PreviewImage
