# Trip Weaver

Project: Travelers App — UI Design

Design a clean, mobile-first interface for a travel app that helps groups plan trips, split costs, and share a photo timeline. Warm, trustworthy, easy to use on the go.

Screens for Tier 1 (design in full detail):

1. Trip Home / Dashboard

List of trips (upcoming/past), destination, dates, cover photo

"Create Trip" flow: name, destination, dates, invite members

2. Itinerary View

Day-by-day tabs or scrollable timeline

Stop cards: name, location pin, weather icon, tourist-spot badge, phone icon when relevant

Separate "Emergency Info" tab: hospitals, embassies, safety numbers

Offline indicator banner when applicable

3. Costs / Split Screen

Prominent "Scan Receipt" button

Confirm card after scanning: editable amount, checkmark to confirm

Person-selector (avatars/chips) for who the cost applies to

Running balance list: who owes whom

Leave room in the layout for a future split-type toggle (equal / by number / by percentage) and "borrow vs. lent" tagging — don't fully design yet, just don't crowd them out

4. Photo Timeline

Grid/timeline grouped by day/activity

Tap to open a day's photo cluster

Simple reassign gesture to move a photo to another day/stop

Sketch loosely (Tier 2, rough placeholders only):

A "Budget" tab or card on the trip dashboard (planned vs. actual, no detailed breakdown yet)

An "After Trip" summary screen concept (total spent, photo count, "Export highlights" button)

Don't design yet: flights/hotels/insurance booking flows, translator, live location sharing, SOS button — leave no placeholders for these so the interface stays uncluttered.

Style direction:

Friendly, rounded UI, clear hierarchy between "planning" and "money" sections (distinct accent colors)

Thumb-reachable primary actions

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0eda786d-ef35-424c-93d5-6b25cdeb9bef).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
