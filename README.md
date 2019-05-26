# EarthEyes

###### SECOND PLACE | ENVIRONMENTAL

A Progressive Web App with computer vision and API access to recognize objects and tell you where they can be recycled (+ more!).

## How does it work?
Open, click camera button, wait, bam! Hit navigation icon for directions to the recycling center.

- Swipe left to access manual search and quick-recycling links
- Swipe right to access (future) cool stuff!

YouTube Video: https://youtu.be/RS1ekTo6DqM

## Technologies

- PWA with Bootstrap, LESS/Flexbox, and jQuery
- Node.js for server-side controller
- Tensorflow.js with MobileNet model for object detection and recognition
- Earth911 API for data on materials and recycling centers
- Google App Engine to host Node server over HTTPS

## Issues

- Model is limited in detection and speed. Solution: train own model with Python and Keras.
- API requests result in 500. Solution: Switch to another hosting platform; GAE blocks some outgoing requests for god-knows-why.

## Stats:
**Main color**: #026928

**Development time**: 17 hours

**Cups of coffee**: 5

**Hours of sleep**: 3

**Presentation time given**: 3 min

**Percent of points explained**: 45%

**Amount of money on Starbucks Gift Card prize when it said $15-$500**: $15
