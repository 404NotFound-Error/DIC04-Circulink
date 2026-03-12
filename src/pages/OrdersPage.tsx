import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle, Truck, DollarSign, User, Calendar, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { apiClient, Order } from '../lib/api';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: {
        role: 'buyer' | 'seller';
        page: number;
        pageSize: number;
        status?: string;
      } = {
        role: activeTab,
        page: 1,
        pageSize: 50
      };
      if (statusFilter !== 'ALL') {
        params.status = statusFilter;
      }
      const response = await apiClient.getOrders(params);
      setOrders(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === 'zh' ? '加载订单失败' : 'Failed to load orders'));
      console.error('Load orders error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, statusFilter, lang]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PAID':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'ACCEPTED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      case 'PAID':
        return <DollarSign className="h-4 w-4" />;
      case 'SHIPPED':
        return <Truck className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatStatus = (status: string) => {
    const map: Record<string, { en: string; zh: string }> = {
      PENDING: { en: 'Pending', zh: '待处理' },
      ACCEPTED: { en: 'Accepted', zh: '已接受' },
      REJECTED: { en: 'Rejected', zh: '已拒绝' },
      PAID: { en: 'Paid', zh: '已支付' },
      SHIPPED: { en: 'Shipped', zh: '已发货' },
      COMPLETED: { en: 'Completed', zh: '已完成' },
      CANCELLED: { en: 'Cancelled', zh: '已取消' }
    };
    return map[status]?.[lang] || status;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-4">{lang === 'zh' ? '请先登录后查看订单' : 'Please sign in to view your orders'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {lang === 'zh' ? '返回首页' : 'Go to Home'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50">
      {/* Header */}
      <div className="bg-white border-b border-emerald-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-emerald-900 flex items-center gap-3">
            <Package className="h-8 w-8" />
            {t('myOrders')}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('buyer')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              activeTab === 'buyer'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            {t('buyingOrders')}
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
              activeTab === 'seller'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            {t('sellingOrders')}
          </button>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-emerald-100">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-semibold text-gray-700 self-center mr-2">{lang === 'zh' ? '筛选：' : 'Filter:'}</span>
            {['ALL', 'PENDING', 'ACCEPTED', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'ALL' ? (lang === 'zh' ? '全部' : 'All') : formatStatus(status)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">{lang === 'zh' ? '正在加载订单...' : 'Loading orders...'}</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-800 font-medium">{error}</p>
            <button
              onClick={loadOrders}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {lang === 'zh' ? '重试' : 'Try Again'}
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-emerald-100">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-600 mb-2">{lang === 'zh' ? '暂无订单' : 'No orders found'}</p>
            <p className="text-sm text-gray-500">
              {activeTab === 'buyer'
                ? (lang === 'zh' ? '开始购物后，你的订单会显示在这里' : 'Start shopping to see your orders here')
                : (lang === 'zh' ? '你售出的商品订单会显示在这里' : 'Your sold items will appear here')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-emerald-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {order.item?.images?.[0] ? (
                        <img
                          src={order.item.images[0]}
                          alt={order.item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Order Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {order.item?.title || (lang === 'zh' ? '商品' : 'Product')}
                          </h3>
                          <p className="text-sm text-gray-600">{lang === 'zh' ? '订单号' : 'Order ID'}: {order.id.slice(0, 8)}...</p>
                        </div>
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border flex items-center gap-1.5 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {formatStatus(order.status)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{t('total')}:</span>
                          <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {activeTab === 'buyer' ? `${t('seller')}:` : `${t('buyer')}:`}
                          </span>
                          <span className="font-medium text-gray-900">
                            {activeTab === 'buyer'
                              ? order.seller?.name || (lang === 'zh' ? '未知用户' : 'Unknown')
                              : order.buyer?.name || (lang === 'zh' ? '未知用户' : 'Unknown')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">{t('orderDate')}:</span>
                          <span className="font-medium text-gray-900">{formatDate(order.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center justify-center sm:justify-start gap-2"
                        >
                          {lang === 'zh' ? '查看详情' : 'View Details'}
                          <ChevronRight className="h-4 w-4" />
                        </button>
                        {order.item?.id && (
                          <button
                            onClick={() => navigate(`/product/${order.item.id}`)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-white border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors text-sm font-medium"
                          >
                            {lang === 'zh' ? '查看商品' : 'View Product'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
