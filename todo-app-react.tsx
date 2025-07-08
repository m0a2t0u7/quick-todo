import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Edit2, Save } from 'lucide-react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('すべて');
  const [currentCategory, setCurrentCategory] = useState('一般');
  const [showCompleted, setShowCompleted] = useState(true);

  const categories = ['すべて', '一般', '仕事', 'プライベート', '買い物', '勉強'];

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const taskTexts = inputValue.split(/[,，\s]+/).map(text => text.trim()).filter(text => text !== '');
      
      const newTodos = taskTexts.map((text, index) => ({
        id: Date.now() + index,
        text: text,
        completed: false,
        category: currentCategory
      }));
      
      setTodos([...todos, ...newTodos]);
      setInputValue('');
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editingText } : todo
    ));
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const filteredTodos = selectedCategory === 'すべて' 
    ? todos 
    : todos.filter(todo => todo.category === selectedCategory);

  const displayTodos = showCompleted 
    ? filteredTodos 
    : filteredTodos.filter(todo => !todo.completed);

  const completedCount = filteredTodos.filter(todo => todo.completed).length;
  const totalCount = filteredTodos.length;

  const getCategoryColor = (category) => {
    const colors = {
      '一般': 'bg-gray-100 text-gray-700',
      '仕事': 'bg-blue-100 text-blue-700',
      'プライベート': 'bg-green-100 text-green-700',
      '買い物': 'bg-yellow-100 text-yellow-700',
      '勉強': 'bg-purple-100 text-purple-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'すべて': '🔍',
      '一般': '📋',
      '仕事': '💼',
      'プライベート': '🏠',
      '買い物': '🛒',
      '勉強': '📚'
    };
    return icons[category] || '📋';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📝 ToDo アプリ
          </h1>
          <p className="text-gray-600">
            {selectedCategory === 'すべて' ? 'すべて' : selectedCategory}: 完了 {completedCount} / {totalCount}
          </p>
        </div>

        {/* 新しいタスクの追加 */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">🆕 新しいタスクを追加</h3>
          <div className="flex gap-2 flex-col sm:flex-row">
            <select
              value={currentCategory}
              onChange={(e) => setCurrentCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              {categories.filter(cat => cat !== 'すべて').map(category => (
                <option key={category} value={category}>
                  {getCategoryIcon(category)} {category}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="タスクを入力（カンマ・スペース区切りで複数追加可能）"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-1"
            >
              <Plus size={18} />
              追加
            </button>
          </div>
        </div>

        {/* フィルター設定 */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">🔍 フィルター設定</h3>
          
          {/* カテゴリ選択 */}
          <div className="mb-4">
            <p className="text-xs text-gray-600 mb-2">カテゴリで絞り込み</p>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {getCategoryIcon(category)} {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* 完了済みタスク表示切り替え */}
          <div>
            <p className="text-xs text-gray-600 mb-2">表示オプション</p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                  showCompleted
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  showCompleted ? 'bg-green-500 border-green-500' : 'border-gray-400'
                }`}>
                  {showCompleted && <Check size={12} className="text-white" />}
                </div>
                完了済みを表示
              </button>
              {!showCompleted && completedCount > 0 && (
                <span className="text-sm text-gray-500">
                  ({completedCount}個の完了済みタスクを非表示)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* タスクリスト */}
        <div className="space-y-3">
          {displayTodos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-2">
                {!showCompleted && filteredTodos.length > 0
                  ? '🎉 未完了のタスクがありません！'
                  : selectedCategory === 'すべて' 
                    ? '📝 まだタスクがありません' 
                    : `📝 「${selectedCategory}」のタスクがありません`}
              </p>
              {!showCompleted && filteredTodos.length > 0 ? (
                <p className="text-gray-400 text-sm">すべてのタスクが完了しています</p>
              ) : (
                <div>
                  <p className="text-gray-400 text-sm mb-1">上のフィールドからタスクを追加してください</p>
                  <p className="text-gray-400 text-xs">💡 ヒント: 「買い物,洗濯,掃除」のような区切りで複数のタスクを一度に追加できます</p>
                </div>
              )}
            </div>
          ) : (
            displayTodos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
                  todo.completed
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-gray-300 hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => toggleComplete(todo.id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                    todo.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {todo.completed && <Check size={16} />}
                </button>

                {editingId === todo.id ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyPress={(e) => handleEditKeyPress(e, todo.id)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(todo.id)}
                      className="text-green-600 hover:text-green-700 p-2 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-gray-600 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 flex items-center gap-3 min-w-0">
                      <span
                        className={`flex-1 ${
                          todo.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-800'
                        } break-words`}
                      >
                        {todo.text}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${getCategoryColor(todo.category)}`}>
                        {getCategoryIcon(todo.category)} {todo.category}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={() => startEditing(todo.id, todo.text)}
                        className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}