const form = document.getElementById('goal-form');
const input = document.getElementById('goal-input');
const errorMsg = document.getElementById('error-msg');
const goalList = document.getElementById('goal-list');
const emptyMsg = document.getElementById('empty-msg');
const counter = document.getElementById('counter');
const filterButtons = document.querySelectorAll('.filter-btn');

let goals = [];
let currentFilter = 'all';

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const text = input.value.trim();

    if (text.length < 3 || text.length > 100) {
        errorMsg.textContent = 'Текст має містити від 3 до 100 символів!';
        errorMsg.style.display = 'block';
        return;
    }

    errorMsg.style.display = 'none';

    const newGoal = {
        id: Date.now(),
        text: text,
        completed: false
    };

    goals.push(newGoal);
    
    input.value = '';
    input.focus();

    render();
});

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        render();
    });
});

function render() {
    goalList.innerHTML = '';

    const filteredGoals = goals.filter(goal => {
        if (currentFilter === 'active') return !goal.completed;
        if (currentFilter === 'completed') return goal.completed;
        return true;
    });

    if (goals.length === 0) {
        emptyMsg.textContent = 'Поки що цілей немає';
        emptyMsg.hidden = false;
    } else if (filteredGoals.length === 0) {
        emptyMsg.textContent = 'Немає цілей у цьому фільтрі';
        emptyMsg.hidden = false;
    } else {
        emptyMsg.hidden = true;
    }

    filteredGoals.forEach(goal => {
        const li = document.createElement('li');
        if (goal.completed) {
            li.classList.add('completed');
        }

        const divContent = document.createElement('div');
        divContent.className = 'goal-content';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = goal.completed;
        
        checkbox.addEventListener('change', () => {
            goal.completed = checkbox.checked;
            render();
        });

        const span = document.createElement('span');
        span.className = 'goal-text';
        span.textContent = goal.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Видалити';
        deleteBtn.style.backgroundColor = '#dc3545';
        
        deleteBtn.addEventListener('click', () => {
            goals = goals.filter(g => g.id !== goal.id);
            render();
        });

        divContent.append(checkbox, span);
        li.append(divContent, deleteBtn);
        goalList.append(li);
    });

    const totalCount = goals.length;
    const completedCount = goals.filter(g => g.completed).length;
    counter.textContent = `Усього: ${totalCount}. Виконано: ${completedCount}`;
}

render();