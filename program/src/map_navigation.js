import { updateAnimation } from './3d';
import { start, targets } from './const';
document.getElementById('hide').addEventListener('click', function () {
    // Hide sidebar and its content
    document.getElementById('sidebar-right').classList.add('hidden');
    document.querySelector('.sidebar-content-right').classList.add('hidden');

    // Show the "show" button and hide the "hide" button
    document.getElementById('show').style.display = 'inline'; // Show the "show" button
    this.style.display = 'none'; // Hide the "hide" button

    // Show the additional buttons when content is hidden
    document.getElementById('uunknown').style.display = 'inline'; // Show "uunknown" button
    document.getElementById('lhome').style.display = 'inline'; // Show "lhome" button
});

document.getElementById('show').addEventListener('click', function () {
    // Show sidebar and its content
    document.getElementById('sidebar-right').classList.remove('hidden');
    document.querySelector('.sidebar-content-right').classList.remove('hidden');

    // Hide the "show" button and show the "hide" button
    this.style.display = 'none'; // Hide the "show" button
    document.getElementById('hide').style.display = 'inline'; // Show the "hide" button

    // Hide the additional buttons when content is showing
    document.getElementById('uunknown').style.display = 'none'; // Hide "uunknown" button
    document.getElementById('lhome').style.display = 'none'; // Hide "lhome" button
});

// Initial setup: Hide the "show" button if the sidebar is visible
if (!document.querySelector('.sidebar-content-right').classList.contains('hidden')) {
    document.getElementById('show').style.display = 'none'; // Hide "show" button if content is already showing
    document.getElementById('hide').style.display = 'inline'; // Show "hide" button

    // Hide additional buttons if content is visible
    document.getElementById('uunknown').style.display = 'none'; // Hide "uunknown" button
    document.getElementById('lhome').style.display = 'none'; // Hide "lhome" button
} else {
    document.getElementById('show').style.display = 'inline'; // Show "show" button
    document.getElementById('hide').style.display = 'none'; // Hide "hide" button
    document.getElementById('uunknown').style.display = 'inline'; // Show "uunknown" button
    document.getElementById('lhome').style.display = 'inline'; // Show "lhome" button
}
function createTree(targets, query = '') {
    const treeContainer = document.getElementById('buildings-tree');
    treeContainer.innerHTML = ''; // Clear the tree container

    Object.keys(targets).forEach((building) => {
        let buildingMatches = false;

        // Create building item
        const buildingItem = document.createElement('li');
        buildingItem.className = 'tree-item';
        const buildingIcon = document.createElement('span');
        buildingIcon.className = 'icon';
        buildingIcon.innerText = '▼ ';

        const buildingText = document.createElement('span');
        buildingText.innerText = `Building: ${building}`;

        buildingItem.appendChild(buildingIcon);
        buildingItem.appendChild(buildingText);

        // Add toggle functionality
        buildingItem.addEventListener('click', function () {
            this.classList.toggle('open');
            buildingIcon.innerText = this.classList.contains('open') ? '▲' : '▼';
        });

        // Create nested floors
        const floorsList = document.createElement('ul');
        floorsList.className = 'nested floor-list';

        Object.keys(targets[building]).forEach((floor) => {
            let floorMatches = false;

            const floorItem = document.createElement('li');
            floorItem.className = 'tree-item';

            const floorIcon = document.createElement('span');
            floorIcon.className = 'icon';
            floorIcon.innerText = '▼    ';

            const floorText = document.createElement('span');
            floorText.innerText = `Floor ${floor}`;

            floorItem.appendChild(floorIcon);
            floorItem.appendChild(floorText);

            // Add toggle functionality
            floorItem.addEventListener('click', function (e) {
                e.stopPropagation(); // Prevent toggling the parent building
                this.classList.toggle('open');
                floorIcon.innerText = this.classList.contains('open') ? '▲' : '▼';
            });

            // Create nested rooms
            const roomsList = document.createElement('ul');
            roomsList.className = 'nested';

            Object.keys(targets[building][floor]).forEach((room) => {
                if (room.toLowerCase().includes(query.toLowerCase())) {
                    floorMatches = true;
                    buildingMatches = true;

                    const roomItem = document.createElement('li');
                    const roomButton = document.createElement('button');
                    roomButton.className = 'room-button';
                    roomButton.innerText = room;

                    // Optional: Add click event to room button
                    roomButton.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent collapsing the floor when clicking the button
                        endFloor = floor;
                        endRoom = room;
                        currentBuilding = building;
                        updateAnimation();
                    });

                    roomItem.appendChild(roomButton);
                    roomsList.appendChild(roomItem);
                }
            });

            if (floorMatches) {
                floorItem.appendChild(roomsList);
                floorsList.appendChild(floorItem);
            }
        });

        if (buildingMatches) {
            buildingItem.appendChild(floorsList);
            treeContainer.appendChild(buildingItem);
        }
    });
}

createTree(targets);

document.getElementById('search-input').addEventListener('input', (event) => {
    const query = event.target.value.trim();
    createTree(targets, query); // Recreate the tree with the search query
});
